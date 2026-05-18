import React, { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { Card, Flex, Grid, Spinner, Text, Badge } from '@sanity/ui'

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
      "berita": count(*[_type == "berita"])
    }`,
    [],
  )

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)

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

        const supabaseUrl = typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_URL
          ? process.env.SANITY_STUDIO_SUPABASE_URL
          : import.meta.env?.SANITY_STUDIO_SUPABASE_URL;

        const supabaseKey = typeof process !== 'undefined' && process.env.SANITY_STUDIO_SUPABASE_ANON_KEY
          ? process.env.SANITY_STUDIO_SUPABASE_ANON_KEY
          : import.meta.env?.SANITY_STUDIO_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase URL or Key is undefined')
        }

        const endpoint = `${supabaseUrl}/rest/v1/reading_logs?order=created_at.desc&limit=50`

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
      } finally {
        if (mounted) setLogsLoading(false)
      }
    }
    fetchLogs()

    return () => {
      mounted = false
    }
  }, [client, query])

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
      <Card padding={4} shadow={1}>
        <Text size={1} muted>
          Dashboard Analytics
        </Text>
        <Text size={3} style={{ marginTop: 20, fontWeight: 700 }}>
          Ringkasan Jumlah Dokumen & Kegiatan
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

      <Card padding={4} shadow={1} style={{ marginTop: '24px' }}>
        <Text size={3} style={{ fontWeight: 700, marginBottom: 20 }}>
          Laporan Aktivitas Literasi Siswa (Live)
        </Text>

        {logsLoading ? (
          <Flex justify="center" padding={4}><Spinner muted /></Flex>
        ) : logs.length === 0 ? (
          <Text muted size={1}>Belum ada data aktivitas.</Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
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
                {logs.map((log, i) => (
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
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#3b82f6' }}>
                      {log.module_slug}
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
  )
}

