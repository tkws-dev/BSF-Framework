# BSF for Hermes Agent

Hermes has native BSF support via skills.

## Installation

Skills are at `~/.hermes/skills/software-development/`:

```
jung-sa-bsf/       ← BSF v3.0 (stable, production)
jung-sa-org/       ← BSF v4.0 (multi-agent)
```

## Usage

### v3.0 (Single Agent)
Load skill and follow BSF pipeline:
```
"ทำ BSF สำหรับ [project]"
```

### v4.0 (Multi-Agent)
Use trigger word "ทีม":
```
"ทีม discovery"     → Spawns 3 specialist agents
"ทีม product dev"   → Spawns Product → 3 Dev Agents
```

## Configuration

For multi-agent mode, configure `~/.hermes/profiles/default/config.yaml`:

```yaml
delegation:
  max_concurrent_children: 3
  max_spawn_depth: 2
  orchestrator_enabled: true
```

## Skills Structure

```
jung-sa-org/
├── SKILL.md              ← Main skill
└── references/
    ├── strategy-playbook.md
    ├── legal-checklist.md
    ├── finance-playbook.md
    ├── product-playbook.md
    └── ops-playbook.md
```

## See Also

- [BSF Framework Docs](../../docs/)
- [Prompts](../../prompts/)
- [Playbooks](../../playbooks/)
