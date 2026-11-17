import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import statRegisteredVoters from '@/assets/home/stat-registered-voters.png'
import statFemale from '@/assets/home/stat-female.png'
import statMale from '@/assets/home/stat-male.png'

export type Stat = {
  label: string
  value: string
  image: StaticImageData
}

// TODO: Get the actual figures from the IEC API and remove the hardcoded values. Create API endpoints in the backend project.
export const voterRegistrationStats: Stat[] = [
  { label: 'Registered voters', value: '29 230 808', image: statRegisteredVoters },
  { label: 'Female', value: '55.27%', image: statFemale },
  { label: 'Male', value: '44.73%', image: statMale },
]

function StatTile({ stat }: { stat: Stat }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Image src={stat.image} alt="" className="h-auto w-54 object-contain" />
      <dt className="mt-2 text-sm text-cei-gray">{stat.label}</dt>
      <dd className="text-[28px] leading-[1.2] font-medium text-cei-navy">{stat.value}</dd>
    </div>
  )
}

export function VoterStats({
  registration = voterRegistrationStats,
}: {
  registration?: Stat[]
}) {
  return (
    <section aria-labelledby="did-you-know" className="border-t border-cei-border pt-10">
      <h2 id="did-you-know" className="text-2xl font-medium text-cei-navy">Did you know?</h2>

      <h3 className="mt-5 text-lg font-medium text-cei-navy">Current voter registration figure</h3>
      <dl className="mt-4 grid gap-6 bg-cei-stat-grey p-5 sm:grid-cols-3">
        {registration.map((stat) => <StatTile key={stat.label} stat={stat} />)}
      </dl>
      <div className="mt-2 flex justify-end">
        <Link href="#" className="inline-flex items-center gap-1 text-base font-medium text-cei-blue hover:underline">
          Voter registration statistics <ChevronRight className="size-5" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
