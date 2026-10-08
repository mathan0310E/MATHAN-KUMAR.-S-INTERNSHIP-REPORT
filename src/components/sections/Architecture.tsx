import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { MicroLabel } from '@/components/ui/card'
import { architecture, type ArchNode } from '@/data/content'
import { useReducedMotion } from '@/hooks/useMedia'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

/** A vertical connector with a single accent pulse travelling down it. */
function Connector({ vertical = true }: { vertical?: boolean }) {
  if (!vertical) {
    return <span className="absolute inset-x-0 h-px bg-white/15" aria-hidden="true" />
  }
  return (
    <span className="relative h-3.5 w-px shrink-0 overflow-hidden bg-white/25" aria-hidden="true">
      <span className="absolute inset-0 animate-[flow_1.9s_linear_infinite] bg-brand" />
    </span>
  )
}

function NodeButton({
  node,
  selected,
  onSelect,
  index,
}: {
  node: ArchNode
  selected: boolean
  onSelect: (node: ArchNode) => void
  index: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => {
        sfx.ui('click')
        onSelect(node)
      }}
      onPointerEnter={() => onSelect(node)}
      aria-pressed={selected}
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        'relative w-full rounded-xl2 border px-4 py-2.5 text-center transition-colors duration-200',
        node.kind === 'io' && 'border-dashed border-white/15',
        node.kind === 'ai' && 'border-brand-line',
        node.kind === 'score' && 'border-brand bg-brand-soft',
        node.kind === 'output' && 'bg-bg-2',
        !node.kind && 'border-white/15',
        selected
          ? 'border-brand bg-brand-soft'
          : 'bg-surface hover:-translate-y-px hover:border-white/25 hover:bg-surface-2',
      )}
    >
      <span className="block font-mono text-[11.5px] tracking-[0.07em] text-ink">
        {node.title}
      </span>
    </motion.button>
  )
}

export function Architecture() {
  const [selectedId, setSelectedId] = useState('controller')

  const byId = useMemo(
    () => Object.fromEntries(architecture.map((n) => [n.id, n])) as Record<string, ArchNode>,
    [],
  )
  const selected = byId[selectedId] ?? byId.controller

  const groups = {
    branchA: ['crawler', 'network', 'events'],
    branchB: ['security', 'bugs', 'flows'],
    outputs: ['dashboard', 'pdf'],
  }

  return (
    <section id="s6" data-label="ARCHITECTURE" className="slide" aria-labelledby="s6-title">
      <div className="wrap">
        <SectionHeading
          nav="06"
          eyebrow="System design"
          title="How it works"
          subtitle="From a URL to a prioritised report"
          id="s6-title"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,.85fr)]">
          <div className="flex flex-col items-center">
            {['user', 'url', 'controller', 'playwright'].map((id, i) => (
              <div key={id} className="flex w-full flex-col items-center">
                {i > 0 && <Connector />}
                <div className={cn('w-full', id === 'playwright' ? 'max-w-[420px]' : 'max-w-[340px]')}>
                  <NodeButton
                    node={byId[id]}
                    index={i}
                    selected={selectedId === id}
                    onSelect={(n) => setSelectedId(n.id)}
                  />
                </div>
              </div>
            ))}

            <div className="relative grid w-full grid-cols-3 gap-3 py-4">
              <Connector vertical={false} />
              {groups.branchA.map((id, i) => (
                <NodeButton
                  key={id}
                  node={byId[id]}
                  index={4 + i}
                  selected={selectedId === id}
                  onSelect={(n) => setSelectedId(n.id)}
                />
              ))}
              <span className="absolute inset-x-0 bottom-0 h-px bg-white/15" aria-hidden="true" />
            </div>

            <div className="w-full max-w-[340px]">
              <NodeButton
                node={byId.analysis}
                index={7}
                selected={selectedId === 'analysis'}
                onSelect={(n) => setSelectedId(n.id)}
              />
            </div>

            <div className="relative grid w-full grid-cols-3 gap-3 py-4">
              <Connector vertical={false} />
              {groups.branchB.map((id, i) => (
                <NodeButton
                  key={id}
                  node={byId[id]}
                  index={8 + i}
                  selected={selectedId === id}
                  onSelect={(n) => setSelectedId(n.id)}
                />
              ))}
              <span className="absolute inset-x-0 bottom-0 h-px bg-white/15" aria-hidden="true" />
            </div>

            {['ai', 'risk', 'score'].map((id, i) => (
              <div key={id} className="flex w-full flex-col items-center">
                {i > 0 && <Connector />}
                <div className="w-full max-w-[340px]">
                  <NodeButton
                    node={byId[id]}
                    index={11 + i}
                    selected={selectedId === id}
                    onSelect={(n) => setSelectedId(n.id)}
                  />
                </div>
              </div>
            ))}

            <div className="relative grid w-full max-w-[62%] grid-cols-2 gap-3 py-4 max-lg:max-w-none">
              <Connector vertical={false} />
              {groups.outputs.map((id, i) => (
                <NodeButton
                  key={id}
                  node={byId[id]}
                  index={14 + i}
                  selected={selectedId === id}
                  onSelect={(n) => setSelectedId(n.id)}
                />
              ))}
            </div>
          </div>

          <aside
            className="h-fit rounded-xl2 border border-white/[0.075] bg-surface p-5 lg:sticky lg:top-[calc(var(--topbar-h)+1rem)]"
            aria-live="polite"
          >
            <MicroLabel className="mb-3">Component detail</MicroLabel>
            <h3 className="mb-2 font-mono text-[15px] font-semibold tracking-[0.02em] text-ink">
              {selected.title}
            </h3>
            <p className="mb-4 text-[13.5px] text-ink-muted">{selected.purpose}</p>

            <dl className="grid gap-px overflow-hidden rounded-xl2 border border-white/[0.075] bg-white/[0.075]">
              {[
                ['Input', selected.input],
                ['Output', selected.output],
                ['Technology', selected.tech],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[74px_1fr] gap-3 bg-bg-2 px-4 py-2.5">
                  <dt className="pt-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-dim">
                    {label}
                  </dt>
                  <dd className="text-[12.5px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[11.5px] text-ink-dim">
              Select any component in the diagram to inspect it.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
