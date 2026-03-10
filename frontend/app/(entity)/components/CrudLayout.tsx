'use client'

import React from 'react'
import { usePermission } from '@/hooks/usePermission'

type CrudLayoutProps = {
  title: string
  subtitle?: string
  rotina?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function CrudLayout({
  title,
  subtitle,
  rotina,
  actions,
  children,
}: CrudLayoutProps) {

  const { canView } = usePermission()

  if (rotina && !canView(rotina)) {
    return (
      <div style={container}>
        <div style={accessDenied}>
          <h2>Acesso negado</h2>
          <p>Você não possui permissão para acessar esta rotina.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={titleStyle}>{title}</h1>
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>

        {actions && <div>{actions}</div>}
      </div>

      <div style={content}>{children}</div>
    </div>
  )
}

/* ===== styles ===== */

const container = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
}

const titleStyle = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 4,
}

const subtitleStyle = {
  fontSize: 14,
  color: '#5b6b82',
}

const content = {
  width: '100%',
}

const accessDenied = {
  padding: 40,
  textAlign: 'center' as const,
}