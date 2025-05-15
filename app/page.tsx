import Companies from "@/components/marketing/companies";
import Connect from "@/components/marketing/connect";
import CTA from "@/components/marketing/cta";
import Hero from "@/components/marketing/hero";
import Perks from "@/components/marketing/perks";
import Pricing from "@/components/marketing/pricing";
import Reviews from "@/components/marketing/reviews";
import FAQ from "@/components/marketing/faq";
import Customize from "@/components/marketing/customize";
// import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
// import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      {/* <Hero /> */}
      <Hero/>
      <Customize/>
      <Companies/>
      <Connect/>
      <Perks/>
      <Pricing/>
      <Reviews/>
      <FAQ/>
      <CTA/>
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
    </>
  );
}
