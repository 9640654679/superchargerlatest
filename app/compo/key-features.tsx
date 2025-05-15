import Images from "../../components/global/images";
import Container from "../../components/global/container";
// import Icons from "../../components/global/icons";
import MagicCard from "../../components/ui/magic-card";
import { SectionBadge } from "../../components/ui/section-bade";
// import Marquee from "../../components/ui/marquee";

export function KeyFeatures() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full bg-black">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <SectionBadge title="Services" />
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6 text-white">
            UDINA Business Technology Platform
          </h2>
          <p className="text-base md:text-lg text-center text-purple-200/90 mt-6">
            Preconfigured ready-to-run solutions to quickly get started with the Intelligent Enterprise.
          </p>
        </div>
        <div className="mt-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full ">
            <MagicCard particles={true} className="flex flex-col items-center justify-center h-full min-h-[18rem] bg-white/5 border-2 border-blue-700 rounded-2xl shadow-xl backdrop-blur-md p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_0_rgba(59,130,246,0.7)] hover:border-blue-400/80">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-blue-300 group-hover:text-blue-400 mx-auto relative">
                  <Images.company1 className="w-20 h-20" />
                </span>
              </div>
              <h4 className="text-xl font-heading font-medium heading text-white mt-6">Connected business processes</h4>
              <p className="text-sm md:text-base mt-2 text-blue-100/80 text-center">UDINA BTP leverages SAP BTP, optimizing processes that cross lines of business and achieve competitive differentiation.</p>
            </MagicCard>
            <MagicCard particles={true} className="flex flex-col items-center justify-center h-full min-h-[18rem] bg-white/5 border-2 border-blue-700 rounded-2xl shadow-xl backdrop-blur-md p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_0_rgba(59,130,246,0.7)] hover:border-blue-400/80">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-blue-300 group-hover:text-blue-400 mx-auto relative">
                  <Images.company3 className="w-20 h-20" />
                </span>
              </div>
              <h4 className="text-xl font-heading font-medium heading text-white mt-6">Multi-cloud openness</h4>
              <p className="text-sm md:text-base mt-2 text-blue-100/80 text-center">Solutions will run in any hyperscaler cloud environment for optimal flexibility for customer solutions.</p>
            </MagicCard>
            <MagicCard particles={true} className="flex flex-col items-center justify-center h-full min-h-[18rem] bg-white/5 border-2 border-blue-700 rounded-2xl shadow-xl backdrop-blur-md p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_0_rgba(59,130,246,0.7)] hover:border-blue-400/80">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-blue-300 group-hover:text-blue-400 mx-auto relative">
                  <Images.company2 className="w-20 h-20" />
                </span>
              </div>
              <h4 className="text-xl font-heading font-medium heading text-white mt-6">Fast time to value</h4>
              <p className="text-sm md:text-base mt-2 text-blue-100/80 text-center">Go live quickly, reduce the payback period, monetize investments, and fund subsequent high-value use cases.</p>
            </MagicCard>
          </div>
        </div>
      </Container>
    </div>
  );
}