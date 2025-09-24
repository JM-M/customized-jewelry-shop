interface ShopPageHeaderProps {
  title: string;
  description?: string | null;
}

export const ShopPageHeader = ({ title, description }: ShopPageHeaderProps) => {
  return (
    <div className="space-y-2">
      <h2 className="font-serif text-2xl">{title}</h2>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};
