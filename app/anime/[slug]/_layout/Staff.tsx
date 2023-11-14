'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import EntryCard from '@/app/_components/EntryCard';
import Link from "next/link";
import ArrowRight from "@/app/_components/icons/ArrowRight";

interface Props {
    extended?: boolean;
}


const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['staff', params.slug],
        queryFn: () => getAnimeStaff({ slug: String(params.slug) }),
    });

    if (!data || !data.list || data.list.length === 0) {
        return null;
    }

    const filteredData = extended ? data.list : data.list.slice(0, 6);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>Автори</h3>
                {!extended && (
                    <Link href={params.slug + "/staff"} className="btn btn-sm btn-ghost btn-square">
                        <ArrowRight className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-6 grid-cols-3 gap-4 md:gap-8">
                {filteredData.map((staff) => (
                        <EntryCard
                            key={staff.person.slug}
                            href={`/person/${staff.person.slug}`}
                            poster={staff.person.image}
                            title={staff.person.name_ua || staff.person.name_en || staff.person.name_native}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Component;