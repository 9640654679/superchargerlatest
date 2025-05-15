"use client";

import Container from "../global/container";
import Icons from "../global/icons";
import Images from "../global/images";
import MagicCard from "../ui/magic-card";
import { Ripple } from "../ui/ripple";
import { SectionBadge } from "../ui/section-bade";

const Features = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Features" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
                        Create content faster <br /> and smarter
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
                        Transform your social media strategy with Luro AI&apos;s cutting-edge features, designed to optimize your content creation and engagement like never before.
                    </p>
                </div>
            </Container>
            <div className="mt-16 w-full">
                <div className="flex flex-col items-center gap-8 w-full">
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
                            <MagicCard particles={true} className="flex flex-col items-center justify-center h-full min-h-[18rem] bg-primary/[0.08]">
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <span className="text-muted-foreground group-hover:text-foreground mx-auto relative">
                                        <Icons.stars className="w-20 h-20" />
                                    </span>
                                    <Ripple />
                                </div>
                            </MagicCard>
                            <MagicCard particles={true} className="flex flex-col justify-center h-full min-h-[18rem] bg-primary/[0.08]">
                                <div className="flex flex-row items-center gap-6 w-full h-full">
                                    <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
                                        <Images.analytics className="w-full h-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-xl font-heading font-medium heading ">
                                            Get advanced analytics
                                        </h4>
                                        <p className="text-sm md:text-base mt-2 text-muted-foreground">
                                            Track your performance with detailed analytics and optimize to get better results.
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>
                    </Container>
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-8">
                            <MagicCard particles={true} className="flex flex-col justify-between h-full min-h-[22rem] bg-primary/[0.08]">
                                <div className="flex flex-row items-center gap-6 w-full h-full">
                                    <div className="w-44 h-52 relative flex-shrink-0 flex items-center justify-center">
                                        <Images.ideation className="w-full h-full" />
                                        <div className="w-40 h-40 rounded-full bg-primary/10 blur-3xl -z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h4 className="text-xl font-heading font-medium heading">
                                            Content ideation
                                        </h4>
                                        <p className="text-sm md:text-base mt-2 text-muted-foreground">
                                            Generate ideas for your content with our AI-powered tools to create engaging posts in seconds.
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                            <div className="flex flex-col gap-8 h-full min-h-[22rem]">
                                <MagicCard particles={true} className="flex flex-col justify-center h-full bg-primary/[0.08]">
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <p className="text-base text-muted-foreground text-center px-4">
                                            We use AI to help you create content that resonates with your audience. Our tools are designed to optimize your content creation and engagement like never before. Transform your social media strategy with Luro AI&apos;s cutting-edge features. Reach your audience with the right message at the right time. Create content faster and smarter with Luro AI.
                                        </p>
                                        <div className="w-full h-16 relative mt-4 flex items-center justify-center">
                                            <Images.centeral className="w-24 h-16" />
                                            <div className="w-20 h-20 rounded-full bg-primary/10 blur-2xl z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                        </div>
                                    </div>
                                </MagicCard>
                                <MagicCard particles={true} className="flex flex-col justify-center h-full bg-primary/[0.08]">
                                    <div className="flex flex-col items-center justify-center w-full h-full relative">
                                        <div className="w-full h-32 flex items-center justify-center relative">
                                            <Images.rings className="w-32 h-32 absolute inset-0" />
                                            <Images.rings className="w-40 h-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            <Icons.icon className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
                                            <Images.circlePallete className="w-full h-full opacity-30" />
                                        </div>
                                        <div className="w-28 h-28 rounded-full bg-primary/10 blur-3xl -z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                </MagicCard>
                            </div>
                            <MagicCard particles={true} className="flex flex-col justify-between h-full min-h-[22rem] bg-primary/[0.08]">
                                <div className="flex flex-row items-center gap-6 w-full h-full">
                                    <div className="flex flex-col mb-auto">
                                        <h4 className="text-xl font-heading font-medium heading ">
                                            Seamless integrations
                                        </h4>
                                        <p className="text-sm md:text-base mt-2 text-muted-foreground">
                                            Connect your favorite tools and platforms to streamline your workflow and save time.
                                        </p>
                                    </div>
                                    <div className="w-32 h-28 relative flex-shrink-0 flex items-center justify-center">
                                        <Images.integration className="w-full h-full" />
                                        <div className="w-28 h-28 rounded-full bg-primary/10 blur-3xl -z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"></div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>
                    </Container>
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
                            <MagicCard particles={true} className="flex flex-col justify-center h-full min-h-[18rem] bg-primary/[0.08]">
                                <div className="flex flex-row items-center gap-6 w-full h-full">
                                    <div className="w-40 flex-shrink-0 flex items-center justify-center">
                                        <Images.image className="w-full h-40 lg:h-auto" />
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h4 className="text-xl font-heading font-medium heading ">
                                            Image generation with AI
                                        </h4>
                                        <p className="text-sm md:text-base mt-2 text-muted-foreground">
                                            Create stunning images with AI-powered tools in seconds.
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                            <MagicCard particles={true} className="flex flex-col justify-center h-full min-h-[18rem] bg-primary/[0.08]">
                                <div className="flex flex-row items-center gap-6 w-full h-full">
                                    <div className="w-40 flex-shrink-0 flex items-center justify-center">
                                        <Images.hash className="w-full h-40 lg:h-52" />
                                    </div>
                                    <div className="flex flex-col mt-auto">
                                        <h4 className="text-xl font-heading font-medium heading ">
                                            Hashtags suggestions
                                        </h4>
                                        <p className="text-sm md:text-base mt-2 text-muted-foreground">
                                            Get hashtag suggestions based on your content and audience to increase your reach and engagement.
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
};

export default Features
