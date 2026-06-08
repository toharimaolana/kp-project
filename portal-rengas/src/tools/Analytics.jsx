import React, { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { Card, Flex, Grid, Spinner, Text, Badge, Box, Stack, Tab, TabList, TabPanel } from '@sanity/ui'

const formatNumber = (value) => {
  if (value === null || value === undefined) return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('id-ID').format(num)
}

export default function AnalyticsTool() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const query = useMemo(
    () => `{
      "guru": count(*[_type == "guru"]),
      "siswa": count(*[_type == "siswa"]),
      "berita": count(*[_type == "berita"]),
      "materi": *[_type == "materiLiterasi"] { "slug": slug.current, title }
    }`,
    [],
  )

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(null)

  const [activeTabId, setActiveTabId] = useState('general')

  // Filter States
  const [selectedClass, setSelectedClass] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(query)
        if (mounted) setStats(data)
      } catch (e) {
        console.error('Analytics GROQ query failed:', e)
        if (mounted) setError(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    const fetchLogs = async () => {
      try {
        setLogsLoading(true)
        setSupabaseError(null)

        const supabaseUrl = typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_URL
          ? process.env.SANITY_STUDIO_SUPABASE_URL
          : import.meta.env?.SANITY_STUDIO_SUPABASE_URL;

        const supabaseKey = typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_ANON_KEY
          ? process.env.SANITY_STUDIO_SUPABASE_ANON_KEY
          : import.meta.env?.SANITY_STUDIO_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase URL or Key is undefined')
        }

        // Fetch up to 500 records to perform significant statistical calculations
        const endpoint = `${supabaseUrl}/rest/v1/reading_logs?order=created_at.desc&limit=500`

        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch from Supabase: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        if (mounted && Array.isArray(data)) {
          setLogs(data)
        }
      } catch (e) {
        console.error('Failed to fetch reading logs:', e)
        if (mounted) setSupabaseError(e.message || String(e))
      } finally {
        if (mounted) setLogsLoading(false)
      }
    }
    fetchLogs()

    return () => {
      mounted = false
    }
  }, [client, query])

  // Mapping slug to actual titles from Sanity
  const materialTitleMap = useMemo(() => {
    if (!stats?.materi) return {}
    const map = {}
    stats.materi.forEach((item) => {
      if (item.slug) {
        map[item.slug] = item.title
      }
    })
    return map
  }, [stats])

  // Extract unique classes from logs dynamically
  const uniqueClasses = useMemo(() => {
    const classes = new Set()
    logs.forEach((log) => {
      if (log.student_class) {
        classes.add(log.student_class.trim().toUpperCase())
      }
    })
    return Array.from(classes).sort()
  }, [logs])

  // Filter logs dynamically
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedClass !== 'ALL') {
        const cls = log.student_class?.trim().toUpperCase()
        if (cls !== selectedClass) return false
      }

      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const logDate = new Date(log.created_at)
        if (logDate < start) return false
      }

      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        const logDate = new Date(log.created_at)
        if (logDate > end) return false
      }

      return true
    })
  }, [logs, selectedClass, startDate, endDate])

  // Calculate statistics from the filtered logs
  const statsComputed = useMemo(() => {
    if (!filteredLogs || filteredLogs.length === 0) return null

    const totalSessions = filteredLogs.length

    // 1. Completion Rate
    const completedCount = filteredLogs.filter((log) => log.status === 'completed').length
    const completionRate = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0

    // 2. Most Popular Modules
    const moduleCounts = {}
    filteredLogs.forEach((log) => {
      if (log.module_slug) {
        moduleCounts[log.module_slug] = (moduleCounts[log.module_slug] || 0) + 1
      }
    })

    const popularModules = Object.entries(moduleCounts)
      .map(([slug, count]) => ({
        slug,
        title: materialTitleMap[slug] || slug,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const mostPopularModule = popularModules[0] || { title: '—', count: 0 }

    // 3. Most Active Classes
    const classCounts = {}
    filteredLogs.forEach((log) => {
      if (log.student_class) {
        const cls = log.student_class.trim().toUpperCase()
        classCounts[cls] = (classCounts[cls] || 0) + 1
      }
    })

    const activeClasses = Object.entries(classCounts)
      .map(([className, count]) => ({
        className,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const mostActiveClass = activeClasses[0] || { className: '—', count: 0 }

    return {
      totalSessions,
      completedCount,
      completionRate,
      mostPopularModule,
      popularModules: popularModules.slice(0, 5), // Top 5
      mostActiveClass,
      activeClasses: activeClasses.slice(0, 5), // Top 5
    }
  }, [filteredLogs, materialTitleMap])

  if (loading) {
    return (
      <Flex padding={4} align="center" justify="center">
        <Spinner muted />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex padding={4} align="center" justify="center">
        <Card padding={4} shadow={1}>
          <Text muted size={1}>
            Gagal memuat analytics.
          </Text>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex padding={4} direction="column" gap={4}>
      {/* Header */}
      <Card padding={4} shadow={1}>
        <Text size={1} muted>
          Dashboard Analytics
        </Text>
        <Text size={3} style={{ marginTop: 20, fontWeight: 700 }}>
          SDN Rengas Portal Analytics
        </Text>
      </Card>

      {/* Tab Navigation */}
      <Card padding={2} shadow={1} style={{ borderRadius: '6px' }}>
        <TabList space={2}>
          <Tab
            aria-controls="general-panel"
            id="general-tab"
            label="Ringkasan Umum (Web)"
            onClick={() => setActiveTabId('general')}
            selected={activeTabId === 'general'}
          />
          <Tab
            aria-controls="literacy-panel"
            id="literacy-tab"
            label="Platform Literasi"
            onClick={() => setActiveTabId('literacy')}
            selected={activeTabId === 'literacy'}
          />
        </TabList>
      </Card>

      {/* Panel 1: Ringkasan Umum (Sanity) */}
      <TabPanel aria-labelledby="general-tab" hidden={activeTabId !== 'general'} id="general-panel">
        <Flex direction="column" gap={4} style={{ marginTop: '4px' }}>
          <Card padding={4} shadow={1}>
            <Text size={2} style={{ fontWeight: 700 }}>
              Jumlah Dokumen & Konten
            </Text>
            <Text size={1} muted style={{ marginTop: 6 }}>
              Data statistik konten statis yang dikelola langsung dari database CMS Sanity.
            </Text>
          </Card>

          <Grid columns={[1, 3]} gap={3}>
            <Card padding={4} shadow={1}>
              <Text size={1} muted>
                Guru
              </Text>
              <Text size={5} style={{ marginTop: 10, fontWeight: 800 }}>
                {formatNumber(stats?.guru)}
              </Text>
            </Card>

            <Card padding={4} shadow={1}>
              <Text size={1} muted>
                Siswa
              </Text>
              <Text size={5} style={{ marginTop: 10, fontWeight: 800 }}>
                {formatNumber(stats?.siswa)}
              </Text>
            </Card>

            <Card padding={4} shadow={1}>
              <Text size={1} muted>
                Berita
              </Text>
              <Text size={5} style={{ marginTop: 10, fontWeight: 800 }}>
                {formatNumber(stats?.berita)}
              </Text>
            </Card>
          </Grid>
        </Flex>
      </TabPanel>

      {/* Panel 2: Platform Literasi (Supabase) */}
      <TabPanel aria-labelledby="literacy-tab" hidden={activeTabId !== 'literacy'} id="literacy-panel">
        <Flex direction="column" gap={4} style={{ marginTop: '4px' }}>
          {/* Supabase Analytics Header */}
          <Card padding={4} shadow={1}>
            <Text size={3} style={{ fontWeight: 700 }}>
              Statistik Literasi Siswa (Supabase)
            </Text>
            <Text size={1} muted style={{ marginTop: 6 }}>
              Dihitung berdasarkan {formatNumber(statsComputed?.totalSessions || 0)} sesi aktivitas membaca terbaru.
            </Text>
          </Card>

          {/* Interactive Filter Bar */}
          {!logsLoading && logs.length > 0 && (
            <Card padding={4} shadow={1} style={{ borderRadius: '6px' }}>
              <Stack gap={3}>
                <Text size={1} style={{ fontWeight: 800, marginBottom: '4px' }} muted>
                  Filter Data Aktivitas:
                </Text>

                <Flex direction={['column', 'row']} gap={3} align="flex-end">
                  {/* Filter Kelas */}
                  <Box flex={1} style={{ width: '100%' }}>
                    <Stack gap={2}>
                      <Text size={1} muted style={{ fontWeight: 500 }}>
                        Kelas:
                      </Text>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--card-border-color, #d1d5db)',
                          backgroundColor: 'var(--card-bg-color, #ffffff)',
                          color: 'var(--card-fg-color, #1f2937)',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          width: '100%',
                          height: '38px',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          marginTop: '14px',
                        }}
                      >
                        <option value="ALL">Semua Kelas</option>
                        {uniqueClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            Kelas {cls}
                          </option>
                        ))}
                      </select>
                    </Stack>
                  </Box>

                  {/* Filter Tanggal Mulai */}
                  <Box flex={1} style={{ width: '100%' }}>
                    <Stack gap={2}>
                      <Text size={1} muted style={{ fontWeight: 500 }}>
                        Mulai Tanggal:
                      </Text>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--card-border-color, #d1d5db)',
                          backgroundColor: 'var(--card-bg-color, #ffffff)',
                          color: 'var(--card-fg-color, #1f2937)',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          width: '100%',
                          height: '38px',
                          boxSizing: 'border-box',
                          marginTop: '14px',
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Filter Tanggal Selesai */}
                  <Box flex={1} style={{ width: '100%' }}>
                    <Stack gap={2}>
                      <Text size={1} muted style={{ fontWeight: 500 }}>
                        Sampai Tanggal:
                      </Text>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--card-border-color, #d1d5db)',
                          backgroundColor: 'var(--card-bg-color, #ffffff)',
                          color: 'var(--card-fg-color, #1f2937)',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          width: '100%',
                          height: '38px',
                          boxSizing: 'border-box',
                          marginTop: '14px',
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Reset Button */}
                  {(selectedClass !== 'ALL' || startDate || endDate) && (
                    <Box style={{ width: ['100%', 'auto'] }}>
                      <button
                        onClick={() => {
                          setSelectedClass('ALL')
                          setStartDate('')
                          setEndDate('')
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          height: '38px',
                          cursor: 'pointer',
                          width: '100%',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Reset Filter
                      </button>
                    </Box>
                  )}
                </Flex>
              </Stack>
            </Card>
          )}

          {/* Supabase Stats Computed */}
          {statsComputed ? (
            <>
              <Grid columns={[1, 2, 4]} gap={3}>
                <Card padding={4} shadow={1}>
                  <Text size={1} muted>
                    Total Sesi Membaca
                  </Text>
                  <Text size={4} style={{ marginTop: 10, fontWeight: 800, color: '#3b82f6' }}>
                    {formatNumber(statsComputed.totalSessions)}
                  </Text>
                  <Text size={1} muted style={{ marginTop: 8 }}>
                    Aktivitas tercatat
                  </Text>
                </Card>

                <Card padding={4} shadow={1}>
                  <Text size={1} muted>
                    Tingkat Penyelesaian
                  </Text>
                  <Text size={4} style={{ marginTop: 10, fontWeight: 800, color: '#10b981' }}>
                    {statsComputed.completionRate.toFixed(1)}%
                  </Text>
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginTop: 12 }}>
                    <div style={{ width: `${statsComputed.completionRate}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '999px' }} />
                  </div>
                </Card>

                <Card padding={4} shadow={1}>
                  <Text size={1} muted>
                    Materi Terpopuler
                  </Text>
                  <Box style={{ marginTop: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Text size={2} style={{ fontWeight: 800 }}>
                      {statsComputed.mostPopularModule.title}
                    </Text>
                  </Box>
                  <Text size={1} muted style={{ marginTop: 8 }}>
                    Dibaca {statsComputed.mostPopularModule.count} kali
                  </Text>
                </Card>

                <Card padding={4} shadow={1}>
                  <Text size={1} muted>
                    Kelas Teraktif
                  </Text>
                  <Text size={4} style={{ marginTop: 10, fontWeight: 800, color: '#8b5cf6' }}>
                    {statsComputed.mostActiveClass.className}
                  </Text>
                  <Text size={1} muted style={{ marginTop: 8 }}>
                    Mencatat {statsComputed.mostActiveClass.count} aktivitas
                  </Text>
                </Card>
              </Grid>

              {/* Top Charts */}
              <Grid columns={[1, 2]} gap={3}>
                {/* Chart 1: Top 5 Materials */}
                <Card padding={4} shadow={1}>
                  <Text size={2} style={{ fontWeight: 700, marginBottom: 16 }}>
                    Top 5 Buku & Materi Terpopuler
                  </Text>
                  <Stack gap={3} style={{ marginTop: 16 }}>
                    {statsComputed.popularModules.map((item, idx) => {
                      const percentage = statsComputed.totalSessions > 0
                        ? (item.count / statsComputed.totalSessions) * 100
                        : 0;
                      return (
                        <Box key={item.slug}>
                          <Flex justify="space-between" align="center">
                            <Box style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <Text size={1} style={{ fontWeight: 600 }}>
                                {idx + 1}. {item.title}
                              </Text>
                            </Box>
                            <Badge tone="primary">{item.count} Sesi</Badge>
                          </Flex>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: 6 }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                          </div>
                        </Box>
                      )
                    })}
                  </Stack>
                </Card>

                {/* Chart 2: Top 5 Classes */}
                <Card padding={4} shadow={1}>
                  <Text size={2} style={{ fontWeight: 700, marginBottom: 16 }}>
                    Top 5 Kelas Teraktif
                  </Text>
                  <Stack gap={3} style={{ marginTop: 16 }}>
                    {statsComputed.activeClasses.map((item, idx) => {
                      const percentage = statsComputed.totalSessions > 0
                        ? (item.count / statsComputed.totalSessions) * 100
                        : 0;
                      return (
                        <Box key={item.className}>
                          <Flex justify="space-between" align="center">
                            <Text size={1} style={{ fontWeight: 600 }}>
                              {idx + 1}. {item.className}
                            </Text>
                            <Badge tone="purple">{item.count} Aktivitas</Badge>
                          </Flex>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: 6 }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                          </div>
                        </Box>
                      )
                    })}
                  </Stack>
                </Card>
              </Grid>
            </>
          ) : (
            <Card padding={4} shadow={1} style={{ textAlign: 'center' }}>
              {logsLoading ? (
                <Text muted size={1}>Mengalkulasi data statistik...</Text>
              ) : supabaseError ? (
                <Stack gap={3}>
                  <Text tone="critical" size={2} style={{ fontWeight: 700 }}>
                    Gagal memuat data dari Supabase
                  </Text>
                  <Text size={1} muted>
                    Detail Error: {supabaseError}
                  </Text>
                  <Text size={1} muted style={{ fontSize: '0.75rem', marginTop: 4 }}>
                    Catatan: Jika error `Failed to fetch` atau `net::ERR_NAME_NOT_RESOLVED`, mohon periksa apakah koneksi internet aktif, atau periksa dashboard Supabase untuk memastikan project Anda tidak di-pause karena tidak aktif.
                  </Text>
                </Stack>
              ) : (
                <Text muted size={1}>Tidak ada data aktivitas literasi yang sesuai dengan filter.</Text>
              )}
            </Card>
          )}

          {/* Live Log Table */}
          <Card padding={4} shadow={1}>
            <Text size={3} style={{ fontWeight: 700, marginBottom: 20 }}>
              Laporan Aktivitas Literasi Siswa (Live)
            </Text>

            {logsLoading ? (
              <Flex justify="center" padding={4}>
                <Spinner muted />
              </Flex>
            ) : filteredLogs.length === 0 ? (
              <Text muted size={1}>
                Tidak ada data aktivitas yang sesuai dengan filter.
              </Text>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    minWidth: '600px',
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Tanggal & Waktu</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Nama Siswa</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Kelas</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Modul yang Dibaca</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.slice(0, 50).map((log, i) => (
                      <tr key={log.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 500 }}>
                          {log.student_name}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                          {log.student_class}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 500 }}>
                          {materialTitleMap[log.module_slug] || log.module_slug}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {log.status === 'completed' ? (
                            <Badge tone="positive" style={{ padding: '4px 8px', borderRadius: '4px' }}>Selesai</Badge>
                          ) : log.status === 'time_up' ? (
                            <Badge tone="caution" style={{ padding: '4px 8px', borderRadius: '4px' }}>Waktu Habis</Badge>
                          ) : (
                            <Badge style={{ padding: '4px 8px', borderRadius: '4px' }}>{log.status}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Flex>
      </TabPanel>
    </Flex>
  )
}
