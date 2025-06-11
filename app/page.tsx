import Companies from "@/components/marketing/companies";
import Connect from "@/components/marketing/connect";
import CTA from "@/components/marketing/cta";
import Hero from "@/components/marketing/hero";
import Perks from "@/components/marketing/perks";
import Pricing from "@/components/marketing/pricing";
import Reviews from "@/components/marketing/reviews";
import FAQ from "@/components/marketing/faq";
import Customize from "@/components/marketing/customize";
import AgentUiProto from "@/components/agent-ui-proto";
import PlatformMetrics from "@/components/platform-metrics";
import HowItWorks from "@/components/how-it-works";
import Features from "@/components/features";
import Hero2 from "@/components/hero2";
import Features2 from "@/components/features2";
import { LampDemo } from "./lampdemo";
import Navbar from "@/components/navbar";
// import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
// import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <Navbar />
      {/* <Hero /> */}
      {/* <Hero/> */}
      <Hero2/>
      {/* <AgentUiProto/> */}
      {/* <Customize/> */}
      <PlatformMetrics/>
      <HowItWorks/>
      {/* <Features/> */}
      {/* <Features2/> */}
      <Companies/>
      {/* <Connect/> */}
      <Perks/>
      {/* <Pricing/> */}
      <Reviews/>
      <FAQ/>
      {/* <LampDemo/> */}
      <CTA/>
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
    </>
  );
}
