<!-- stardust:provenance
writtenBy: stardust:direct
writtenAt: 2026-05-09T13:45:10Z
againstInput: "Bolder and more distinctive"
synthesized: "dimension mapping, assumptions, command plan"
authoredByUser: "intent phrase, source origin"
readArtifacts: [".agents/skills/stardust/reference/intent-dimensions.md", ".agents/skills/stardust/reference/intent-reasoning.md", ".agents/skills/stardust/reference/impeccable-command-map.md", "stardust/current/urls.txt"]
-->

# Direction 2026-05-09

Reading "Bolder and more distinctive":
- register: brand (inferred from public editorial/marketing site surface)
- expressive axis: committed -> drenched (move upward)
- tone: neutral -> playful (slight move)
- density: balanced (leave as default for brand register)
- distinctiveness: distinctive -> singular (move upward)
- audience: existing ops/engineering readership (assumed)
- constraints: brand-faithful, content-preserved, accessibility-safe

## Movement
- Moves: expressive axis, distinctiveness, tone
- Pinned: brand-faithful, content-preserved
- Leaves alone: density (balanced), register (brand)

## Initial command plan
1. detect --json https://www.opsinventor.com
   - baseline anti-pattern and quality scan before design moves.
2. shape "Bolder and more distinctive while preserving brand cues"
   - establish target brief for expressive and distinctiveness shift.
3. bolder
   - increase commitment and visual contrast.
4. typeset
   - move typography to carry stronger personality.
5. colorize
   - reinforce distinctiveness with palette-level decisions.
6. craft
   - generate first redesigned target page(s).
7. critique
   - score redesign output against quality dimensions.
8. polish
   - final refinement pass for consistency and finish.

## Notes
- Browser-backed `detect` is currently blocked by missing system dependency `libnspr4.so` in this environment.
- Sitemap discovery succeeded (245 URLs) and is saved in `stardust/current/urls.txt`.
- Next execution step is extraction/crawl bootstrap for first 25 pages or a user-adjusted cap.
