# Operations Playbook 🏗️
## SOP, Checklist & Quality Template

> ใช้โดย Ops Agent ตอน BSF Part 01 + Phase 2
> ออกแบบ workflow ปฏิบัติการ — สำหรับธุรกิจที่มีคนทำงานจริง

---

## Operational Framework

### 1. Service Delivery Flow

```
STEP 1: ________ → STEP 2: ________ → STEP 3: ________ → DONE
  Owner:          Owner:              Owner:
  Tool:           Tool:               Tool:
  SLA:            SLA:                SLA:
```

### 2. Standard Operating Procedure (SOP)

```
SOP-[ID]: [ชื่อกระบวนการ]
─────────────────────────
Objective:
Prerequisites:
Steps:
  1. [Action] → [Expected Result]
  2. ...
  3. ...
Quality Check:
  - [ ] Criteria 1
  - [ ] Criteria 2
Escalation:
  - If [condition] → escalate to [role]
```

---

## Checklist Template

### Digital Checklist Format
```json
{
  "id": "inspection-v1",
  "name": "ตรวจบ้านมาตรฐาน",
  "version": "1.0",
  "categories": [
    {
      "name": "โครงสร้าง",
      "items": [
        {"id": "s1", "text": "หลังคา — ตรวจรอยรั่ว", "type": "pass_fail_photo"},
        {"id": "s2", "text": "ผนัง — ตรวจรอยร้าว", "type": "rating_1_5"},
        {"id": "s3", "text": "พื้น — ตรวจความเรียบ", "type": "pass_fail"}
      ]
    },
    {
      "name": "ระบบไฟฟ้า",
      "items": [...]
    },
    {
      "name": "ระบบประปา",
      "items": [...]
    }
  ]
}
```

### Checklist Item Types
| Type | UI | Example |
|------|-----|---------|
| `pass_fail` | ✅/❌ toggle | "หลังคารั่วหรือไม่" |
| `pass_fail_photo` | ✅/❌ + 📷 required | "ถ่ายรูปจุดที่พบปัญหา" |
| `rating_1_5` | ⭐ 1-5 scale | "สภาพสีผนัง" |
| `text` | free text | "หมายเหตุเพิ่มเติม" |
| `measurement` | number + unit | "รอยร้าวกว้าง ___ มม." |

---

## Quality Assurance

### QA Process
```
1. Random audit: ___% of all jobs
   - Frequency: [daily / weekly / monthly]
   - Auditor: [role]

2. QA Criteria:
   - [ ] Checklist complete (all required items)
   - [ ] Photos meet quality (resolution, clarity)
   - [ ] Report delivered within SLA
   - [ ] Customer satisfaction > ___/5

3. Flagged jobs:
   - If score < ___ → review by supervisor
   - If complaint → immediate review
```

### Quality Scoring
```
Score per job = 
  (checklist_completion% × 0.3) +
  (photo_quality% × 0.2) +
  (on_time% × 0.3) +
  (customer_rating × 0.2)

Pass: ≥ 80%
Warning: 60-79%
Fail: < 60% → retraining required
```

---

## Provider Onboarding

### Certification Process
```
Step 1: Application
  - Profile + documents + portfolio
  - Required documents: _______

Step 2: Verification
  - Document check (license, ID, etc.)
  - Background check? [YES/NO]

Step 3: Training
  - Online course: [hours]
  - Practical test: [tasks]
  - Pass criteria: ≥ ___%

Step 4: Probation
  - First ___ jobs supervised
  - Review after ___ jobs
  - Full certification if pass

Step 5: Ongoing
  - Re-certification every ___ months
  - Continuing education: ___ hours/year
```

---

## SLA Template

| Service Level | Target | Measurement |
|--------------|--------|-------------|
| Response time | < ___ min | Time from booking to provider accept |
| Arrival time | < ___ min | Time from accept to on-site |
| Service delivery | < ___ min/hrs | Time from arrival to completion |
| Report delivery | < ___ hrs | Time from completion to report sent |
| Issue resolution | < ___ hrs | Time from complaint to resolution |

---

## Incident Management

### Issue Severity Levels
| Level | Definition | Response | Resolution |
|-------|-----------|----------|------------|
| 🔴 Critical | Safety hazard, legal risk | < 15 min | < 2 hrs |
| 🟠 High | Service cannot be delivered | < 1 hr | < 4 hrs |
| 🟡 Medium | Quality complaint | < 4 hrs | < 24 hrs |
| 🟢 Low | Minor issue, feedback | < 24 hrs | < 72 hrs |

### Escalation Matrix
```
Level 1: Provider handles directly
Level 2: Ops team intervenes
Level 3: CEO (พี่ tkws) decides
```
