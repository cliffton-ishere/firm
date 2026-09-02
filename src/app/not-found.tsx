import { Container } from "@/components/chrome/Layout";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center pb-24 pt-[calc(var(--nav-h)+80px)]">
      <div className="max-w-[46ch]">
        <p className="label text-lime">404</p>
        <h1 className="display mt-6 text-[clamp(2.2rem,5vw,3.6rem)] text-gallery">
          No firm at this address.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-mist">
          The page you asked for is not part of the market. The Genesis Nine are
          all listed in the marketplace.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/firms" variant="primary" size="lg">
            Open the marketplace
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="lg">
            Back to the hero
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
