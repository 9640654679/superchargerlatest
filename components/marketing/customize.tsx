import Image from "next/image";
import Container from "../global/container";

const Customize = () => {
  return (
    <div className="w-full  py-12 md:py-20">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text Section */}
          <div className="flex-1 w-full max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-8">
              Make every survey uniquely yours
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">Brand your surveys</h3>
                <p className="text-base text-muted-foreground">
                  Apply your organization's fonts, colors, and logo to every survey. Every question, result, and chart reflects your unique brand identity for a seamless, professional experience.
                </p>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-semibold text-primary mb-1">Customize questions & logic</h3>
                <p className="text-base text-muted-foreground">
                  Tailor every survey with custom questions, branching logic, and scoring. Deliver personalized experiences and gather the insights that matter most to you and your audience.
                </p>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-semibold text-primary mb-1">Drag-and-drop survey builder</h3>
                <p className="text-base text-muted-foreground">
                  Effortlessly build surveys with our intuitive drag-and-drop interface. Add sections, reorder questions, and preview your survey in real time—no coding required.
                </p>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-semibold text-primary mb-1">AI-powered analytics</h3>
                <p className="text-base text-muted-foreground">
                  Instantly visualize responses with beautiful charts and get actionable insights from our AI analysis. Make smarter decisions, faster.
                </p>
              </div>
            </div>
          </div>
          {/* Illustration Section */}
          <div className="flex-1 w-full flex items-center justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-pink-100 p-6 md:p-10 shadow-lg max-w-md w-full">
              <Image
                src="/images/dashboard.png"
                alt="Survey customization illustration"
                width={400}
                height={350}
                className="rounded-2xl object-contain w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Customize; 