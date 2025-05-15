type PLAN = {
    id: string;
    title: string;
    desc: string;
    monthlyPrice: number;
    yearlyPrice: number;
    badge?: string;
    buttonText: string;
    features: string[];
    link: string;
};

export const PLANS: PLAN[] = [
    {
        id: "free",
        title: "Free",
        desc: "Get started with essential survey tools and AI-powered analytics.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        buttonText: "Get Started Free",
        features: [
            "Unlimited survey creation",
            "Up to 100 responses/month",
            "Basic AI-powered analysis",
            "Standard charts & reports",
            "Email support",
            "Export results (CSV)"
        ],
        link: "https://stripe.com/free-plan-link"
    },
    {
        id: "pro",
        title: "Pro",
        desc: "Unlock advanced survey features, deeper AI insights, and more responses.",
        monthlyPrice: 10,
        yearlyPrice: 120,
        badge: "Most Popular",
        buttonText: "Upgrade to Pro",
        features: [
            "Unlimited surveys & questions",
            "Up to 5,000 responses/month",
            "Advanced AI-powered analysis & summaries",
            "Custom branding",
            "Team collaboration",
            "Priority email support",
            "Advanced charts & filtering",
            "Integrations (Slack, Zapier, Google Sheets)"
        ],
        link: "https://stripe.com/pro-plan-link"
    },
    {
        id: "enterprise",
        title: "Enterprise",
        desc: "Tailored solutions for large organizations with custom needs and dedicated support.",
        monthlyPrice: 15,
        yearlyPrice: 180,
        badge: "Contact Sales",
        buttonText: "Upgrade to Enterprise",
        features: [
            "Unlimited surveys & responses",
            "Custom AI-powered analytics & reporting",
            "Dedicated account manager",
            "Single sign-on (SSO)",
            "Enterprise-grade security",
            "Custom integrations",
            "Dedicated onboarding & training",
            "24/7 priority support"
        ],
        link: "https://stripe.com/enterprise-plan-link"
    }
];
