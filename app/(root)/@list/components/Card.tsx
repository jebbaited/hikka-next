import Image from '@/app/components/Image';
import Link, { LinkProps } from 'next/link';

interface Props extends LinkProps {
    title_en: string;
    poster: string;
}

const Component = ({ poster, title_en, ...props }: Props) => {
    return (
        <Link className="flex flex-col gap-2" {...props}>
            <div className="w-full bg-inherit pt-[140%] relative overflow-hidden rounded-lg">
                <div className="absolute w-full h-full top-0 left-0">
                    <figure className="w-full h-full">
                        <Image
                            src={poster}
                            width={184}
                            height={259}
                            className="w-full h-full object-cover"
                            alt="Poster"
                        />
                    </figure>
                </div>
            </div>
            <div className="py-3 pr-3">
                <h2 className="text-white">{title_en}</h2>
            </div>
        </Link>
    );
};

export default Component;
