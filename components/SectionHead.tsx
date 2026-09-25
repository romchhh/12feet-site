type Props = {
  kicker: string;
  title: string;
  lead?: string;
};

export default function SectionHead({ kicker, title, lead }: Props) {
  return (
    <header className="section-head center">
      <h2 className="section-title">
        {kicker} {title}
      </h2>
      {lead ? <p className="section-lead center-lead">{lead}</p> : null}
    </header>
  );
}
