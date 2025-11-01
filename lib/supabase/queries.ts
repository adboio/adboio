import { cache } from "react";
import { createClient } from "./client";
import type { Tables, TablesInsert } from "./types";

// Build Log type with joined relations
export type BuildLogEntry = Tables<"build_log"> & {
  build_images: Pick<Tables<"build_images">, "path">[];
  build_links: Pick<Tables<"build_links">, "platform" | "link">[];
};

// Build Log queries
export const getBuildLogEntries = cache(async (): Promise<BuildLogEntry[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("build_log")
    .select(
      `
      *,
      build_images(path),
      build_links(platform, link)
    `,
    )
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching build log entries:", error);
    return [];
  }

  return data || [];
});

export const getBuildLogEntry = cache(
  async (id: number): Promise<BuildLogEntry | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("build_log")
      .select(
        `
      *,
      build_images(path),
      build_links(platform, link)
    `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching build log entry:", error);
      return null;
    }

    return data;
  },
);

export async function createBuildLogEntry(
  entry: TablesInsert<"build_log">,
  images?: string[],
  socialLinks?: { platform: string; url: string }[],
): Promise<BuildLogEntry | null> {
  const supabase = createClient();

  // Insert the main entry
  const { data, error } = await supabase
    .from("build_log")
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error("Error creating build log entry:", error);
    return null;
  }

  // Insert related images if provided
  if (images && images.length > 0) {
    const { error: imagesError } = await supabase
      .from("build_images")
      .insert(images.map((path) => ({ entry_id: data.id, path })));

    if (imagesError) {
      console.error("Error inserting images:", imagesError);
    }
  }

  // Insert related social links if provided
  if (socialLinks && socialLinks.length > 0) {
    const { error: linksError } = await supabase.from("build_links").insert(
      socialLinks.map((link) => ({
        entry_id: data.id,
        platform: link.platform,
        link: link.url,
      })),
    );

    if (linksError) {
      console.error("Error inserting social links:", linksError);
    }
  }

  // Return the created entry with relations
  return {
    ...data,
    build_images: images?.map((path) => ({ path })) || [],
    build_links:
      socialLinks?.map((link) => ({
        platform: link.platform,
        link: link.url,
      })) || [],
  };
}

export async function updateBuildLogEntry(
  id: number,
  entry: Partial<TablesInsert<"build_log">>,
  images?: string[],
  socialLinks?: { platform: string; url: string }[],
): Promise<BuildLogEntry | null> {
  const supabase = createClient();

  // Update the main entry
  const { data, error } = await supabase
    .from("build_log")
    .update(entry)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating build log entry:", error);
    return null;
  }

  // Handle images - only update if provided
  if (images !== undefined) {
    // Get existing images
    const { data: existingImages } = await supabase
      .from("build_images")
      .select("path")
      .eq("entry_id", id);

    const existingPaths = existingImages?.map((img) => img.path) || [];
    const newPaths = images;

    // Find images to delete (in existing but not in new)
    const pathsToDelete = existingPaths.filter(
      (path) => !newPaths.includes(path),
    );

    // Find images to add (in new but not in existing)
    const pathsToAdd = newPaths.filter((path) => !existingPaths.includes(path));

    // Delete removed images
    if (pathsToDelete.length > 0) {
      await supabase
        .from("build_images")
        .delete()
        .eq("entry_id", id)
        .in("path", pathsToDelete);
    }

    // Insert new images
    if (pathsToAdd.length > 0) {
      const { error: imagesError } = await supabase
        .from("build_images")
        .insert(pathsToAdd.map((path) => ({ entry_id: id, path })));

      if (imagesError) {
        console.error("Error inserting new images:", imagesError);
      }
    }
  }

  // Handle social links - only update if provided
  if (socialLinks !== undefined) {
    // Get existing links
    const { data: existingLinks } = await supabase
      .from("build_links")
      .select("platform, link")
      .eq("entry_id", id);

    const existingLinkStrings =
      existingLinks?.map((l) => `${l.platform}:${l.link}`) || [];
    const newLinkStrings = socialLinks.map((l) => `${l.platform}:${l.url}`);

    // Find links to delete
    const linksToDelete =
      existingLinks?.filter(
        (existing) =>
          !newLinkStrings.includes(`${existing.platform}:${existing.link}`),
      ) || [];

    // Find links to add
    const linksToAdd = socialLinks.filter(
      (newLink) =>
        !existingLinkStrings.includes(`${newLink.platform}:${newLink.url}`),
    );

    // Delete removed links
    if (linksToDelete.length > 0) {
      for (const link of linksToDelete) {
        await supabase
          .from("build_links")
          .delete()
          .eq("entry_id", id)
          .eq("platform", link.platform)
          .eq("link", link.link);
      }
    }

    // Insert new links
    if (linksToAdd.length > 0) {
      const { error: linksError } = await supabase.from("build_links").insert(
        linksToAdd.map((link) => ({
          entry_id: id,
          platform: link.platform,
          link: link.url,
        })),
      );

      if (linksError) {
        console.error("Error inserting new links:", linksError);
      }
    }
  }

  // Return the updated entry with fresh relations
  return getBuildLogEntry(id);
}
