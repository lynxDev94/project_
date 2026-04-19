import { HomeClient } from "./_components/home-client";
import { HomeJsonLd } from "./_components/home-json-ld";

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <HomeClient />
    </>
  );
}
