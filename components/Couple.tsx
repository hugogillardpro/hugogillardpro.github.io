// « Sophie & Quentin » avec l'esperluette en italique doré.
export default function Couple({ nom }: { nom: string }) {
  const parts = nom.split(' & ');
  if (parts.length !== 2) return <>{nom}</>;
  return (
    <>
      {parts[0]} <span className="amp">&amp;</span> {parts[1]}
    </>
  );
}
