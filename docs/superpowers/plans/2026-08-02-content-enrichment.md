# Content Enrichment: Merge Writeup Into Existing Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the 6 content-light pages by merging approved writeup copy into their existing structure, adding new sections below the existing hero grid and callout.

**Architecture:** Each page currently has 2 sections (Hero Grid + Full-bleed Callout). We add 3-6 new content sections below, using the same design language (cards, grids, quotes, stats). No new routes or components needed — just JSX additions within existing page files.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion

## Global Constraints

- All pages use `"use client"` — no server-only APIs
- Styling: Tailwind CSS v4, single quotes, 2-line indent
- Existing sections (Hero Grid + Callout) must NOT be modified
- New sections go AFTER the existing Section 2 (callout)
- Use existing UI patterns: `max-w-7xl mx-auto`, `grid grid-cols-*`, `text-3xl font-medium`, `text-muted-foreground`
- Bible verse quotes use the pattern: `<p className='text-foreground/60 text-xl'>` for attribution
- All writeup copy is already approved — preserve language, adapt formatting only

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Modify | `app/watches/page.tsx` | Add 5 new content sections from writeup |
| Modify | `app/music-and-worship/page.tsx` | Add 5 new content sections from writeup |
| Modify | `app/prayer-wall/page.tsx` | Add 5 new content sections from writeup |
| Modify | `app/scripture-reading/page.tsx` | Add 5 new content sections from writeup |
| Modify | `app/start-an-altar/page.tsx` | Add 4 new content sections from writeup |
| Modify | `app/partner/page.tsx` | Add 3 new content sections from writeup |

---

### Task 1: Expand Watches page with writeup content

**Files:**
- Modify: `app/watches/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/watches/page.tsx` to understand the exact structure and find the insertion point (after Section 2's closing `</section>` tag).

- [ ] **Step 2: Add "What Is a Watch?" section**

Insert after the existing Section 2 closing `</section>` and before `</main>`:

```tsx
{/* ── Section 3: What Is a Watch ─────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "So, he left Asaph and his brothers there before the ark of the covenant of the Lord to minister before the ark regularly, as every day's work required."
          <br />— 1 Chronicles 16:37
        </p>
      </div>
      <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>What Is a Watch?</h2>
        <p className='text-muted-foreground text-lg leading-relaxed mb-6'>
          A watch is a dedicated period of continuous ministry unto the Lord. Each watch becomes a moment of worship, a time of intercession, a gathering around God's presence, and a spiritual assignment carried by worshippers and watchmen.
        </p>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Throughout the 144 hours, the altar remains active continuously with simultaneous expressions of: Praise &amp; Worship, Prayer &amp; Intercession, Bible Reading, and Thanksgiving &amp; Adoration. Every watch contributes to sustaining the continuous sound ascending before the Lord.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 4: The Structure of the Watches ─────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>The Structure of the Watches</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {[
        { title: "Corporate Praise", desc: "United voices exalting the Lord together" },
        { title: "Deep Worship", desc: "Intimate moments of adoration and surrender" },
        { title: "Scripture Reading", desc: "The Word of God proclaimed continuously" },
        { title: "Intercession", desc: "Standing in the gap for nations and families" },
        { title: "Prophetic Songs", desc: "Spirit-led musical expressions" },
        { title: "Instrumental Worship", desc: "Musical ministry without words" },
        { title: "Thanksgiving", desc: "Celebrating God's faithfulness" },
        { title: "Declarations", desc: "Proclaiming God's promises over the earth" },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 5: The Night Watches ────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='col-span-4 lg:mt-0 lg:pr-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>The Night Watches</h2>
        <p className='text-muted-foreground text-lg leading-relaxed mb-6'>
          Particular emphasis is placed on the night watches. Throughout Scripture, the night watches were moments of prayer, spiritual alertness, divine encounters, intercession, and worship before the Lord.
        </p>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          The midnight and early morning watches become powerful moments of consecration, deep worship, and standing in the gap for nations, families, communities, and generations.
        </p>
      </div>
      <div className='col-span-2 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "I have set watchmen on your walls, O Jerusalem; they shall never hold their peace day or night."
          <br />— Isaiah 62:6
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 6: A Place for Everyone ─────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>A Place for Everyone</h2>
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {["Worshipper", "Intercessor", "Musician", "Choir Member", "Scripture Reader", "Volunteer", "Watch Leader", "Partner"].map((role) => (
        <div key={role} className='p-4 rounded-xl bg-muted/40 border border-border/50 text-center'>
          <span className='font-semibold text-sm'>{role}</span>
        </div>
      ))}
    </div>
    <p className='text-muted-foreground text-lg text-center mt-8'>
      The altar is not sustained by one person or one ministry alone. It is carried collectively by worshippers from different backgrounds and nations united in one purpose — to glorify the Lord continuously.
    </p>
  </div>
</section>

{/* ── Section 7: Take Your Watch CTA ──────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>Take Your Watch</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      This is more than attendance. It is participation. It is responding to the call to stand before the Lord and minister unto Him. Whether during the day or through the midnight hours, every watch matters.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/get-involved'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Join The Altar</Button>
      </Link>
      <Link href='/prayer-wall'>
        <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>Submit Prayer Request</Button>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/watches`. Scroll through all sections.
Expected: 7 sections total — original 2 + 5 new content sections.

- [ ] **Step 4: Commit**

```bash
git add app/watches/page.tsx
git commit -m "feat: expand watches page with writeup content sections"
```

---

### Task 2: Expand Music & Worship page with writeup content

**Files:**
- Modify: `app/music-and-worship/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/music-and-worship/page.tsx` to find the insertion point after Section 2.

- [ ] **Step 2: Add 5 new sections**

Insert after Section 2's closing `</section>` and before `</main>`:

```tsx
{/* ── Section 3: The Sound of the Altar ───────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "David and the leaders of the army set apart for the ministry some of the sons of Asaph, Heman, and Jeduthun, who were to prophesy with lyres, harps and cymbals."
          <br />— 1 Chronicles 25:1
        </p>
      </div>
      <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>The Sound of The Altar</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          For 144 continuous hours, a living sound rises before the Lord through praise, worship, instrumental ministry, spontaneous songs, scripture songs, prophetic expressions, corporate adoration, thanksgiving, and prayer &amp; intercession. This sound is carried by worshippers, choirs, psalmists, instrumentalists, worship leaders, and musicians from different churches, ministries, backgrounds, and nations united together for one purpose — to glorify the Lord continuously.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 4: A Davidic Worship Expression ──────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>A Davidic Worship Expression</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[
        { title: "Presence-Centered", desc: "Worship built around the presence of God, not personalities or performances" },
        { title: "Continuous Ministry", desc: "Unbroken offering of praise, adoration, and devotion unto the Lord" },
        { title: "Musical Excellence", desc: "Spiritual depth combined with musical skill and devotion" },
        { title: "Worship & Scripture", desc: "Songs joined with prayer and the Word of God" },
        { title: "Prophetic Expressions", desc: "Spirit-led songs, declarations, and musical moments" },
        { title: "Corporate Unity", desc: "Multiple nations, backgrounds, and expressions united in one sound" },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 5: Sounds From the Nations ──────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='col-span-4 lg:mt-0 lg:pr-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Sounds From the Nations</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Over the years, the Non-Stop Series has hosted ministers, choirs, and worshippers from multiple nations across Africa and the world. This gathering of sounds, languages, instruments, cultures, and worship expressions reflects the prophetic picture of nations worshipping together before God.
        </p>
      </div>
      <div className='col-span-2 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "Let the peoples praise You, O God; let all the peoples praise You."
          <br />— Psalm 67:3
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 6: The Role of Music in Revival ──────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>The Role of Music in Revival</h2>
    <p className='text-muted-foreground text-lg text-center max-w-3xl mx-auto mb-8'>
      We believe worship is not merely inspirational — it is transformational. Throughout Scripture, worship shifted atmospheres, opened heavens, released victory, brought healing, gathered people into God's presence, and prepared hearts for revival.
    </p>
    <p className='text-muted-foreground text-lg text-center max-w-3xl mx-auto'>
      As continuous worship rises before the Lord, we believe hearts are awakened, lives are renewed, and nations are impacted by the glory of God.
    </p>
  </div>
</section>

{/* ── Section 7: Join The Sound CTA ───────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>Join The Sound</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      Whether you are a singer, musician, psalmist, worshipper, choir member, or simply someone who desires to minister unto the Lord, there is a place for you on the altar. Come and take your watch. Lift your sound.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/live'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Listen Live</Button>
      </Link>
      <Link href='/get-involved'>
        <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>Take Your Watch</Button>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/music-and-worship`. Scroll through all sections.
Expected: 7 sections total.

- [ ] **Step 4: Commit**

```bash
git add app/music-and-worship/page.tsx
git commit -m "feat: expand music-and-worship page with writeup content sections"
```

---

### Task 3: Expand Prayer Wall page with writeup content

**Files:**
- Modify: `app/prayer-wall/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/prayer-wall/page.tsx` to find the insertion point after Section 2.

- [ ] **Step 2: Add 5 new sections**

Insert after Section 2's closing `</section>` and before `</main>`:

```tsx
{/* ── Section 3: Submit Your Prayer Request ────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "Again, I say to you that if two of you agree on earth concerning anything that they ask, it will be done for them by My Father in heaven."
          <br />— Matthew 18:19
        </p>
      </div>
      <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Submit Your Prayer Request</h2>
        <p className='text-muted-foreground text-lg leading-relaxed mb-4'>
          We invite you to share your prayer needs with us. Whether you are believing God for:
        </p>
        <div className='grid grid-cols-2 gap-2 mb-6'>
          {["Healing and restoration", "Family and relationships", "Salvation of loved ones", "Employment and provision", "Academic success", "Ministry and leadership", "Business and career growth", "Breakthrough and direction", "Peace and encouragement", "National and global concerns"].map((item) => (
            <span key={item} className='text-sm text-muted-foreground'>• {item}</span>
          ))}
        </div>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Our intercessors will stand in agreement with you during the continuous prayer watches.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 4: Prayer For the Nations ───────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Prayer For the Nations</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[
        { title: "Nations and Governments", desc: "Leadership, wisdom, and divine direction" },
        { title: "Peace and Justice", desc: "Conflict resolution and righteous governance" },
        { title: "Revival and Awakening", desc: "Spiritual renewal across communities" },
        { title: "Families and Communities", desc: "Restoration, unity, and healing" },
        { title: "Education and Leadership", desc: "Godly wisdom in institutions" },
        { title: "Economic Transformation", desc: "Provision and stewardship" },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 5: Share Your Testimony ─────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='col-span-4 lg:mt-0 lg:pr-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Share Your Testimony</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Has God answered your prayer? Has the Lord healed, restored, provided, protected, or transformed your life? We would love to hear your testimony. Your testimony strengthens faith, encourages others, and gives glory to God.
        </p>
      </div>
      <div className='col-span-2 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "Let the redeemed of the Lord tell their story."
          <br />— Psalm 107:2
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 6: How You Can Participate ──────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>How You Can Participate</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {[
        { title: "Submit a Prayer Request", desc: "Share your need confidentially with our prayer teams." },
        { title: "Pray For Others", desc: "Stand in faith for fellow believers and nations." },
        { title: "Share a Testimony", desc: "Encourage others by declaring what the Lord has done." },
        { title: "Join A Prayer Watch", desc: "Become part of the continuous chain of intercession." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 7: We Are Praying with You CTA ──────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>We Are Praying with You</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      Whatever season you may be facing, know that you are not standing alone. Together, we lift our voices, our prayers, and our faith before the Lord. The altar remains open.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/contact'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Submit Your Request</Button>
      </Link>
      <Link href='/watches'>
        <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>Join A Prayer Watch</Button>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/prayer-wall`. Scroll through all sections.
Expected: 7 sections total.

- [ ] **Step 4: Commit**

```bash
git add app/prayer-wall/page.tsx
git commit -m "feat: expand prayer-wall page with writeup content sections"
```

---

### Task 4: Expand Scripture Reading page with writeup content

**Files:**
- Modify: `app/scripture-reading/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/scripture-reading/page.tsx` to find the insertion point after Section 2.

- [ ] **Step 2: Add 5 new sections**

Insert after Section 2's closing `</section>` and before `</main>`:

```tsx
{/* ── Section 3: Why Continuous Scripture Reading? ─────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "Your word is a lamp to my feet and a light to my path."
          <br />— Psalm 119:105
        </p>
      </div>
      <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Why Continuous Scripture Reading?</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          The Word of God is living, powerful, and transformative. When the Scriptures are read aloud: faith is strengthened, hearts are encouraged, truth is established, minds are renewed, God's purposes are proclaimed, and His presence is magnified. The Non-Stop Series seeks to restore the centrality of God's Word within the life of worship.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 4: Reading The Whole Counsel of God ──────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Reading The Whole Counsel of God</h2>
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
      {["Psalms", "The Gospels", "Acts", "Prophetic Books", "Wisdom Literature", "Epistles", "Worship Passages", "Revival Scriptures"].map((book) => (
        <div key={book} className='p-4 rounded-xl bg-muted/40 border border-border/50 text-center'>
          <span className='font-semibold text-sm'>{book}</span>
        </div>
      ))}
    </div>
    <p className='text-muted-foreground text-lg text-center mt-8'>
      Each reading contributes to the atmosphere of worship and spiritual renewal throughout the event.
    </p>
  </div>
</section>

{/* ── Section 5: Scripture And Revival ─────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='col-span-4 lg:mt-0 lg:pr-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Scripture And Revival</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Throughout history, revival has often been accompanied by a renewed hunger for God's Word. The Non-Stop Series embraces the conviction that genuine revival requires both the Spirit of God and the Word of God working together. As Scripture is continuously proclaimed during the 144 hours, we pray for spiritual awakening, personal transformation, national renewal, and a deeper love for God and His Word.
        </p>
      </div>
      <div className='col-span-2 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "The grass withers, the flower fades, but the word of our God stands forever."
          <br />— Isaiah 40:8
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 6: Join The Reading ──────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Join The Reading</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[
        { title: "Read Assigned Passages", desc: "Participate by reading Scripture during a watch." },
        { title: "Join Scripture Reading Watches", desc: "Sign up for a dedicated Scripture reading slot." },
        { title: "Meditate on Daily Readings", desc: "Follow along with the daily reading plan." },
        { title: "Follow the Schedule Online", desc: "View the full reading schedule from anywhere." },
        { title: "Declare God's Promises", desc: "Speak Scripture over families and communities." },
        { title: "Pray the Scriptures", desc: "Let the Word guide your prayer and intercession." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 7: The Word Will Continue CTA ────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>The Word Will Continue</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      For 144 hours, the Scriptures will be proclaimed. The voice of God will continue to be heard. Join us as we honour, declare, and celebrate the living Word of God.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/get-involved'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Sign Up to Read</Button>
      </Link>
      <Link href='/live'>
        <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>Follow Along Live</Button>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/scripture-reading`. Scroll through all sections.
Expected: 7 sections total.

- [ ] **Step 4: Commit**

```bash
git add app/scripture-reading/page.tsx
git commit -m "feat: expand scripture-reading page with writeup content sections"
```

---

### Task 5: Expand Start an Altar page with writeup content

**Files:**
- Modify: `app/start-an-altar/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/start-an-altar/page.tsx` to find the insertion point after Section 2.

- [ ] **Step 2: Add 4 new sections**

Insert after Section 2's closing `</section>` and before `</main>`:

```tsx
{/* ── Section 3: Suggested Models ──────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Suggested Models</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[
        { title: "Family Altar", duration: "1–3 Hours", desc: "Worship, prayer, Bible reading, and thanksgiving. Perfect for families and close friends." },
        { title: "Community Altar", duration: "3–6 Hours", desc: "Bring together families, neighbours, local churches, and prayer groups for community transformation." },
        { title: "Church Worship Watch", duration: "6–12 Hours", desc: "Organize rotating teams for worship, prayer, and Scripture reading. Great for monthly or quarterly gatherings." },
        { title: "City Altar", duration: "12–24 Hours", desc: "Bring churches and ministries together in one continuous expression of worship and prayer." },
        { title: "Regional & National", duration: "24 Hours+", desc: "Mobilize churches, ministries, worship teams, and intercessors across a region or nation." },
        { title: "The Four Expressions", duration: "Any Duration", desc: "Every altar should include: Praise & Worship, Prayer & Intercession, Bible Reading, and Thanksgiving." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <span className='text-amber-500 text-xs font-mono font-bold uppercase'>{item.duration}</span>
          <h3 className='font-semibold text-lg mb-2 mt-1'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 4: Resources To Help You Start ───────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Resources To Help You Start</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[
        { title: "Starter Guide", desc: "A practical introduction to planning your first worship and prayer gathering." },
        { title: "Host Manual", desc: "Step-by-step guidance for organizing a Non-Stop event in your context." },
        { title: "Watch Planning Templates", desc: "Sample schedules for 3, 6, 12, and 24-hour gatherings." },
        { title: "Scripture Reading Plans", desc: "Suggested Bible reading schedules for different durations." },
        { title: "Prayer Focus Guides", desc: "Themes and prayer points for individuals, families, and communities." },
        { title: "Promotional Materials", desc: "Editable flyers, graphics, videos, and communication templates." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 5: The Fire Must Spread ──────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='col-span-4 lg:mt-0 lg:pr-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>The Fire Must Spread</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Our prayer is not merely for one successful annual gathering. Our prayer is that worship, prayer, and the Word would take root in homes, churches, campuses, communities, cities, and nations. One family, one church, one community, one city, one nation at a time.
        </p>
      </div>
      <div className='col-span-2 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "On that day I will raise up the tabernacle of David which has fallen down."
          <br />— Amos 9:11
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 6: Start An Altar Today CTA ──────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>Start An Altar Today</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      You do not need to wait for the perfect moment. Gather people. Open the Scriptures. Lift your voice. Pray together. Worship together. Build an altar. Recover. Revive. Restore.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/contact'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Register Your Altar</Button>
      </Link>
      <Link href='/watches'>
        <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>See Example Watches</Button>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/start-an-altar`. Scroll through all sections.
Expected: 6 sections total.

- [ ] **Step 4: Commit**

```bash
git add app/start-an-altar/page.tsx
git commit -m "feat: expand start-an-altar page with writeup content sections"
```

---

### Task 6: Expand Partner page with writeup content

**Files:**
- Modify: `app/partner/page.tsx`

- [ ] **Step 1: Read the full current page**

Read `app/partner/page.tsx` fully to find the insertion point after Section 2 (DonationOptions) and before Section 3 (the existing callout).

- [ ] **Step 2: Add 3 new sections**

Insert after the DonationOptions section and before the existing Section 3 (full-bleed image callout):

```tsx
{/* ── Section 3: Become An Asaph ──────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container space-y-10 lg:space-y-20'>
    <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
      <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
        <p className='text-foreground/60 text-xl md:text-xl'>
          "So, he left Asaph and his brothers there before the ark of the covenant of the Lord to minister before the ark regularly, as every day's work required."
          <br />— 1 Chronicles 16:37
        </p>
      </div>
      <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
        <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-6'>Become An Asaph for This Generation</h2>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          King David appointed Asaph and others to minister continually before the Ark of the Covenant. The ministry of worship required people who were willing to support and sustain the vision. Today, we invite you to become an "Asaph" for this generation by helping establish and maintain continuous worship before the Lord.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ── Section 4: Ways To Partner ──────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Ways To Partner</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
      {[
        { title: "Sponsor A Watch", desc: "Help sustain one or more worship watches during the 144-hour altar. Your sponsorship supports worship teams, prayer teams, Scripture readers, and logistics." },
        { title: "Support The Livestream", desc: "Help extend the sound of the altar to homes, churches, workplaces, and nations around the world through live broadcasting." },
        { title: "Support Worship & Prayer Teams", desc: "Partner toward the practical needs of the many ministers, volunteers, musicians, and intercessors who serve throughout the 144 hours." },
        { title: "Support The Movement", desc: "Help strengthen the long-term vision of establishing continuous worship, prayer, and Scripture reading beyond a single event." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 5: Other Ways to Give ───────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center'>Other Ways to Give</h2>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
      {[
        { title: "Service", desc: "Volunteer your time, skills, and expertise to sustain the altar." },
        { title: "Equipment & Resources", desc: "Support with technical equipment, media resources, transportation, hospitality, and logistics." },
        { title: "Prayer & Advocacy", desc: "Commit to praying for the vision and share it with your church, ministry, family, and networks." },
      ].map((item) => (
        <div key={item.title} className='p-6 rounded-xl bg-muted/40 border border-border/50 text-center'>
          <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
          <p className='text-sm text-muted-foreground'>{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── Section 6: Our Commitment ───────────────────────────── */}
<section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
  <div className='container text-center space-y-8'>
    <h2 className='text-3xl font-medium lg:text-4xl leading-relaxed'>Our Commitment</h2>
    <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
      We are committed to stewarding every partnership and contribution with integrity, accountability, and faithfulness to the vision entrusted to us. Our desire is not simply to host an event but to build a lasting legacy of worship that glorifies God and impacts generations.
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link href='/get-involved'>
        <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>Join The Movement</Button>
      </Link>
    </div>
  </div>
</section>
```

Note: Renumber the existing callout section from "Section 3" to "Section 7" if it has a comment label, or leave it as-is since it's the final visual section.

- [ ] **Step 3: Verify page renders**

Run: `bun run dev` and navigate to `/partner`. Scroll through all sections.
Expected: 7 sections total (hero + donations + 3 new + existing callout).

- [ ] **Step 4: Commit**

```bash
git add app/partner/page.tsx
git commit -m "feat: expand partner page with writeup content sections"
```

---

## Spec Coverage Check

| Page | Task | Sections Added |
|------|------|----------------|
| Watches | Task 1 | +5 (What Is a Watch, Structure, Night Watches, Place for Everyone, CTA) |
| Music & Worship | Task 2 | +5 (Sound of Altar, Davidic Expression, Nations, Music in Revival, CTA) |
| Prayer Wall | Task 3 | +5 (Submit Request, Nations, Testimony, Participate, CTA) |
| Scripture Reading | Task 4 | +5 (Why Continuous, Whole Counsel, Revival, Join, CTA) |
| Start an Altar | Task 5 | +4 (Models, Resources, Fire Must Spread, CTA) |
| Partner | Task 6 | +3 (Asaph, Ways to Partner, Other Ways, Commitment) |
