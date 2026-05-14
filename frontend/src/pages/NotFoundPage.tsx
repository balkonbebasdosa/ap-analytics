import { ArrowLeft } from "lucide-react";
import { HexButton } from "@/components/ui/HexButton";
import { FallbackScreen } from "@/components/FallbackScreen";

export default function NotFoundPage() {
  return (
    <FallbackScreen
      code="404"
      eyebrow="Error · Not found"
      title="This page doesn't exist."
      description="The page you're looking for moved, was removed, or never existed in the first place. Let's get you back on track."
      actions={
        <>
          <HexButton as="a" href="/" variant="solid">
            <ArrowLeft size={14} /> Back home
          </HexButton>
          <HexButton as="a" href="/history" variant="outline">
            View your analyses
          </HexButton>
        </>
      }
    />
  );
}
