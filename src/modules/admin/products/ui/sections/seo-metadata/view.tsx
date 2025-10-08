"use client";

interface SeoMetadataViewProps {
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export const SeoMetadataView = ({
  metaTitle,
  metaDescription,
}: SeoMetadataViewProps) => {
  if (!metaTitle && !metaDescription) {
    return (
      <p className="text-muted-foreground text-sm">
        No SEO metadata configured
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {metaTitle && (
        <div>
          <label className="text-sm font-medium">Meta Title</label>
          <p className="text-muted-foreground mt-1">{metaTitle}</p>
        </div>
      )}

      {metaDescription && (
        <div>
          <label className="text-sm font-medium">Meta Description</label>
          <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
            {metaDescription}
          </p>
        </div>
      )}
    </div>
  );
};
