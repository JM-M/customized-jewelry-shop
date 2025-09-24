interface PageHeaderProps {
  title: string;
  description: string;
}

export const AdminPageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
