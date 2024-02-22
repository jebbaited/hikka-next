import { ReactNode } from 'react';

import Filters from '@/components/filters';

import NavBar from './_components/navbar';

interface Props {
    children: ReactNode;
}

const Component = async ({ children }: Props) => {
    return (
        <div>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <div className="flex flex-col gap-8">
                    <NavBar />
                    {children}
                </div>
                <div className="order-1 hidden w-full lg:order-2 lg:block bg-secondary/30 border border-secondary/60 rounded-md sticky top-20 opacity-60 hover:opacity-100 transition-opacity">
                    <Filters type="anime" className="px-4" />
                </div>
            </div>
        </div>
    );
};

export default Component;