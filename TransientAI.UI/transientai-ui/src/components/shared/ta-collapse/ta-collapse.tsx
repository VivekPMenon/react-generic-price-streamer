import { AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Accordion } from "radix-ui";
import { ReactNode } from "react";

interface CollapseContainerProps {
    title: ReactNode;
    children?: ReactNode;
    className?: string;
}

export const CollapseContainer = ({ title, children, className }: CollapseContainerProps) => {
    return (
        <div className={className}>
            <Accordion.Root
                className="w-full bg-[#161a25] rounded-md p-4"
                type="single"
                defaultValue="item-1"
                collapsible
            >
                <AccordionItem value="item-1" className="border-none">
                    <div className="flex items-center justify-between w-full text-lg">
                        {title}
                        <AccordionTrigger className="group">
                            <i className="fa-solid fa-chevron-down transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180 cursor-pointer"></i>
                        </AccordionTrigger>
                    </div>
                    <AccordionContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="pt-2 pb-4">
                            {children}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion.Root>
        </div>
    );
}