import React, { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { Card, Flex, Grid, Spinner, Text } from '@sanity/ui'

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
    </Flex>
  )
}

