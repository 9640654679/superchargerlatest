import Link from "next/link";
import Container from "../global/container";
import Wrapper from "../global/wrapper";

const Footer = () => {
    return (
        <footer className="w-full py-10 relative bg-transparent">
            <Container>
                <Wrapper className="flex flex-col items-center justify-center pb-10">
                    <div className="flex flex-row gap-4 mt-4">
                        <Link href="#" className="text-sm text-blue-400 hover:underline">Imprint</Link>
                        <span className="text-sm text-gray-400">|</span>
                        <Link href="#" className="text-sm text-blue-400 hover:underline">Privacy Policy</Link>
                    </div>
                    <p className="text-sm text-secondary-foreground mt-4 text-center">
                        Copyright © 2020-2025 SuperCharger
                    </p>
                </Wrapper>
            </Container>
        </footer>
    )
};

export default Footer
