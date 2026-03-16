import { useState, useEffect, useRef } from 'react'

function TocList({ items, activeId, onItemClick, listRef }) {
  const [barStyle, setBarStyle] = useState({ top: '0.375rem', height: '1rem' })

  useEffect(() => {
    if (!listRef.current || !activeId) return
    const activeLink = listRef.current.querySelector('[aria-current="true"]')
    if (activeLink) {
      const li = activeLink.closest('li')
      const listRect = listRef.current.getBoundingClientRect()
      const liRect = li.getBoundingClientRect()
      setBarStyle({
        top: liRect.top - listRect.top + 'px',
        height: liRect.height + 'px',
      })
    }
  }, [activeId, listRef])

  return (
    <ol
      ref={listRef}
      data-toc-list=""
      style={{
        '--active-top': barStyle.top,
        '--active-height': barStyle.height,
      }}
    >
      {items.map(item => (
        <li key={item.id} data-toc-item="">
          <a
            href={`#${item.id}`}
            aria-current={activeId === item.id ? 'true' : undefined}
            onClick={onItemClick ? (e) => { e.preventDefault(); onItemClick(item.id) } : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function Sidebar({ sections, appendices, onAppendixClick }) {
  const [activeId, setActiveId] = useState('')
  const summaryListRef = useRef(null)
  const appendixListRef = useRef(null)
  const isScrollingRef = useRef(false)
  const scrollTimerRef = useRef(null)

  useEffect(() => {
    // Track the most visible section, not every one that enters the viewport
    const sectionRatios = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        // During a programmatic scroll (nav click), ignore intermediate hits
        if (isScrollingRef.current) return

        entries.forEach(entry => {
          sectionRatios.set(entry.target.id, entry.intersectionRatio)
        })

        // Find the section with the highest visibility
        let bestId = null
        let bestRatio = 0
        sectionRatios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })

        if (bestId) {
          setActiveId(bestId)
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],
      }
    )

    const allIds = [...sections, ...appendices].map(s => s.id)
    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Listen for scroll events to detect programmatic scrolls
    const handleScrollStart = () => {
      // Don't set isScrolling here - only set it on nav clicks
    }

    return () => observer.disconnect()
  }, [sections, appendices])

  // Wrap nav clicks to suppress intermediate observer updates
  const handleNavClick = (id, callback) => {
    isScrollingRef.current = true
    clearTimeout(scrollTimerRef.current)

    // Set active immediately to the target
    setActiveId(id)

    if (callback) {
      callback(id)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Re-enable observer after scroll settles
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }

  const isSummaryActive = sections.some(s => s.id === activeId)
  const isAppendixActive = appendices.some(a => a.id === activeId)

  // Create click-wrapped items for summary
  const summaryItems = sections.map(s => ({
    ...s,
  }))

  const appendixItems = appendices.map(a => ({
    ...a,
  }))

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <svg className="sidebar-logo-icon" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 91.992188 68.085938 L 91.992188 68.082031 C 97.289062 58.863281 94.144531 47.078125 84.972656 41.757812 C 75.800781 36.433594 64.070312 39.59375 58.773438 48.808594 L 49.183594 65.5 C 43.886719 74.71875 32.15625 77.875 22.984375 72.554688 C 13.808594 67.230469 10.664062 55.445312 15.960938 46.226562 L 20.753906 37.886719 C 23.402344 33.277344 21.832031 27.386719 17.242188 24.722656 C 12.65625 22.0625 6.789062 23.640625 4.140625 28.25 L 4.136719 28.253906 C -1.160156 37.472656 1.984375 49.261719 11.160156 54.582031 C 20.332031 59.90625 32.0625 56.746094 37.359375 47.527344 L 46.949219 30.839844 C 52.246094 21.617188 63.976562 18.460938 73.152344 23.78125 C 82.324219 29.105469 85.46875 40.890625 80.171875 50.109375 L 75.378906 58.449219 C 72.730469 63.058594 74.300781 68.953125 78.890625 71.613281 C 83.476562 74.277344 89.34375 72.695312 91.992188 68.085938 Z" fill="currentColor" fillRule="nonzero"/>
        </svg>
        <svg className="sidebar-logo-wordmark" viewBox="0 0 203 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24.427H6.6C6.95 27.7044 9.15 30.1113 12.95 30.1113C15.95 30.1113 18.3 28.4214 18.3 26.0145C18.3 18.794 0.552498 22.6859 0.552498 10.0883C0.552498 4.50645 5.0025 0 12.1525 0C20.1525 0 23.9525 5.73548 24.1525 10.9589H17.5525C17.3525 8.19355 15.4525 5.8379 12.1525 5.8379C8.8525 5.8379 6.9525 7.68145 6.9525 10.0883C6.9525 16.8992 24.7 12.9048 24.7 26.0145C24.7 31.9548 19 36.0004 12.95 36.0004C3.9 36.0004 0.15 29.4456 0 24.427Z" fill="currentColor"/>
          <path d="M25.8516 23.4057C25.8516 16.1852 31.1016 10.8594 38.2516 10.8594C44.3516 10.8594 48.8516 14.5977 49.8016 20.1283H43.6516C42.7516 17.8239 40.9516 16.5436 38.4016 16.5436C34.7516 16.5436 32.1016 19.3602 32.1016 23.4057C32.1016 27.4513 34.7516 30.3191 38.4016 30.3191C40.9516 30.3191 42.7016 29.0388 43.6516 26.6832H49.8016C48.8516 32.2138 44.3516 36.0033 38.2516 36.0033C31.1016 36.0033 25.8516 30.6263 25.8516 23.4057Z" fill="currentColor"/>
          <path d="M50.8516 23.4057C50.8516 16.2876 56.1016 10.8594 63.4016 10.8594C70.7016 10.8594 75.9516 16.2876 75.9516 23.4057C75.9516 30.5239 70.7016 36.0033 63.4016 36.0033C56.1016 36.0033 50.8516 30.5239 50.8516 23.4057ZM69.6991 23.4057C69.6991 19.3602 67.0491 16.4924 63.3991 16.4924C59.7491 16.4924 57.0991 19.3602 57.0991 23.4057C57.0991 27.4513 59.7491 30.3191 63.3991 30.3191C67.0491 30.3191 69.6991 27.5025 69.6991 23.4057Z" fill="currentColor"/>
          <path d="M78 35.44V21.2549C78 15.4682 81.3 10.8594 87.9 10.8594C89.1 10.8594 90 10.9618 91.05 11.2178V17.0557C90.3 17.0045 89.65 17.0045 89.35 17.0045C85.85 17.0045 84.35 18.6432 84.35 21.9719V35.44H78Z" fill="currentColor"/>
          <path d="M115.388 25.6078H97.6406C98.3906 28.8852 100.641 30.6263 103.691 30.6263C106.441 30.6263 107.991 29.8582 108.941 28.1682H114.791C113.341 33.4941 108.591 36.0033 103.841 36.0033C96.5406 36.0033 91.6406 30.6775 91.6406 23.4057C91.6406 16.134 96.6406 10.8594 103.691 10.8594C110.741 10.8594 115.491 16.2364 115.491 23.4057C115.491 24.3275 115.491 24.686 115.391 25.6078H115.388ZM97.5906 21.1013H109.541C109.141 18.2848 106.741 16.2364 103.691 16.2364C100.641 16.2364 98.2906 18.1824 97.5906 21.1013Z" fill="currentColor"/>
          <path d="M143.838 11.5179C143.838 18.6872 138.637 22.5792 132.437 22.5792H124.838V35.4328H118.438V0.507812H132.437C138.637 0.507812 143.838 4.34854 143.838 11.5179ZM131.437 16.3828C134.987 16.3828 137.338 14.6417 137.338 11.5179C137.338 8.3941 134.988 6.70418 131.488 6.70418H124.838V16.3828H131.437Z" fill="currentColor"/>
          <path d="M145.984 35.4328V0.507812H152.284V35.4328H145.984Z" fill="currentColor"/>
          <path d="M179.186 23.457V35.44H173.586L173.186 31.8553C171.686 34.467 168.986 36.0033 165.586 36.0033C159.436 36.0033 154.336 30.9848 154.336 23.4057C154.336 16.2364 159.636 10.8594 166.786 10.8594C173.936 10.8594 179.186 15.6731 179.186 23.457ZM172.936 23.4057C172.936 19.2066 170.236 16.4924 166.786 16.4924C163.336 16.4924 160.586 19.309 160.586 23.4057C160.586 27.5025 163.236 30.3191 166.786 30.3191C169.836 30.3191 172.936 28.117 172.936 23.4057Z" fill="currentColor"/>
          <path d="M195.991 11.3672H202.891L190.041 45.5753H182.991L187.291 35.4869L178.141 11.3672H185.191L189.641 25.1426C190.091 26.474 190.341 27.7031 190.541 29.1882H190.641C190.841 27.7031 191.141 26.474 191.541 25.1426L195.991 11.3672Z" fill="currentColor"/>
        </svg>
        <div className="sidebar-title">Semantic Search</div>
      </div>

      <div className="nav-item-wrapper">
        <div className="sidebar-section-label">Executive Summary</div>
        <div className="nav-toc">
          <TocList
            items={summaryItems}
            activeId={isSummaryActive ? activeId : null}
            listRef={summaryListRef}
            onItemClick={(id) => handleNavClick(id)}
          />
        </div>
      </div>

      <div className="nav-item-wrapper">
        <div className="sidebar-section-label">Appendices</div>
        <div className="nav-toc">
          <TocList
            items={appendixItems}
            activeId={isAppendixActive ? activeId : null}
            onItemClick={(id) => handleNavClick(id, onAppendixClick)}
            listRef={appendixListRef}
          />
        </div>
      </div>

      <div className="sidebar-footer">
        <a href="/case-study-1">Case Study 1 →</a>
      </div>
    </nav>
  )
}
