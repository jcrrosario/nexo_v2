'use client'

import { useEffect, useState, CSSProperties } from 'react'
import {
  FileText,
  FileSpreadsheet,
  Plus,
  Pencil,
  Trash2,
  Clock,
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import CrudLayout from '../../components/CrudLayout'
import CrudTable from '../../components/CrudTable'
import CrudPagination from '../../components/CrudPagination'
import { api } from '@/lib/api'
import { usePermission } from '@/hooks/usePermission'

type Usuario = {
  user_id: string
  nome: string
  email: string
  perfil: 'Administrador' | 'Usuario'
  ativo: 'Sim' | 'Não'
  created_at?: string
  updated_at?: string
  user_id_log?: string
}

export default function UsuariosPage() {

  const { canCreate, canEdit, canDelete } = usePermission()

  const [dados,setDados] = useState<Usuario[]>([])
  const [page,setPage] = useState(1)
  const [total,setTotal] = useState(0)

  const [open,setOpen] = useState(false)
  const [editando,setEditando] = useState(false)
  const [confirmar,setConfirmar] = useState<Usuario | null>(null)
  const [log,setLog] = useState<Usuario | null>(null)
  const [aviso,setAviso] = useState<string | null>(null)

  const [form,setForm] = useState<any>({
    user_id:'',
    nome:'',
    email:'',
    senha:'',
    perfil:'Usuario',
    ativo:'Sim'
  })

  const pageSize = 5

  function avisar(msg:string){
    setAviso(msg)
  }

  async function carregar(){
    const res = await api.get(`/entity/usuarios?page=${page}&limit=${pageSize}`)
    setDados(res.data)
    setTotal(res.total)
  }

  useEffect(()=>{
    carregar()
  },[page])

  function novoUsuario(){

    if(!canCreate('CAD_USUARIO')){
      avisar('Você não possui permissão para incluir usuários.')
      return
    }

    setForm({
      user_id:'',
      nome:'',
      email:'',
      senha:'',
      perfil:'Usuario',
      ativo:'Sim'
    })

    setEditando(false)
    setOpen(true)
  }

  function editarUsuario(usuario:Usuario){
    setForm(usuario)
    setEditando(true)
    setOpen(true)
  }

  async function salvar(){

    if(!form.email){
      avisar('O campo e-mail é obrigatório.')
      return
    }

    try{

      if(editando){
        await api.put(`/entity/usuarios/${form.user_id}`,form)
      }else{

        if(!canCreate('CAD_USUARIO')){
          avisar('Você não possui permissão para incluir usuários.')
          return
        }

        await api.post('/entity/usuarios',form)
      }

      setOpen(false)
      carregar()

    }catch{
      avisar('Não foi possível salvar.')
    }
  }

  async function excluir(){

    if(!confirmar) return

    if(!canDelete('CAD_USUARIO')){
      avisar('Você não possui permissão para excluir usuários.')
      return
    }

    await api.put(`/entity/usuarios/${confirmar.user_id}/excluir`,{})
    setConfirmar(null)
    carregar()
  }

  function gerarPDF(){

    if(!canEdit('CAD_USUARIO')){
      avisar('Você não possui permissão para emitir relatório.')
      return
    }

    const doc = new jsPDF()

    doc.text('Relatório de Usuários',14,20)

    autoTable(doc,{
      startY:30,
      head:[['Nome','Email','Perfil','Status']],
      body:dados.map(u=>[
        u.nome,
        u.email,
        u.perfil,
        u.ativo
      ])
    })

    doc.save('usuarios.pdf')
  }

  function gerarExcel(){

    if(!canEdit('CAD_USUARIO')){
      avisar('Você não possui permissão para emitir relatório.')
      return
    }

    const ws = XLSX.utils.json_to_sheet(dados)

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,'Usuarios')

    XLSX.writeFile(wb,'usuarios.xlsx')
  }

  return(

    <CrudLayout
      rotina="CAD_USUARIO"
      title="Usuários"
      subtitle="Gerencie os usuários do sistema"
      actions={
        <div style={actions}>

          <button style={btnDark} onClick={gerarPDF}>
            <FileText size={16}/> PDF
          </button>

          <button style={btnExcel} onClick={gerarExcel}>
            <FileSpreadsheet size={16}/> Excel
          </button>

          <button style={btnPrimary} onClick={novoUsuario}>
            <Plus size={16}/> Novo usuário
          </button>

        </div>
      }
    >

      <CrudTable
        columns={[
          {key:'nome',label:'Nome'},
          {key:'email',label:'E-mail'},
          {key:'perfil',label:'Perfil'},
          {key:'ativo',label:'Status'},
          {
            key:'actions',
            label:'Ações',
            render:u=>(

              <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>

                <button
                  style={btnIcon}
                  onClick={()=>{

                    if(!canEdit('CAD_USUARIO')){
                      avisar('Você não possui permissão para alterar usuários.')
                      return
                    }

                    editarUsuario(u)

                  }}
                >
                  <Pencil size={14}/>
                </button>

                <button
                  style={btnInfo}
                  onClick={()=>window.location.href=`/dashboard/usuarios/permissoes?user_id=${u.user_id}`}
                >
                  🔐
                </button>

                <button
                  style={btnInfo}
                  onClick={()=>setLog(u)}
                >
                  <Clock size={14}/>
                </button>

                <button
                  style={btnDelete}
                  onClick={()=>{

                    if(!canDelete('CAD_USUARIO')){
                      avisar('Você não possui permissão para excluir usuários.')
                      return
                    }

                    setConfirmar(u)
                  }}
                >
                  <Trash2 size={14}/>
                </button>

              </div>

            )
          }
        ]}
        data={dados}
      />

      <CrudPagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {open && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editando ? 'Editar usuário' : 'Novo usuário'}</h3>

            <input
              style={input}
              placeholder="Nome"
              value={form.nome}
              onChange={e=>setForm({...form,nome:e.target.value})}
            />

            <input
              style={input}
              placeholder="Email"
              value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})}
            />

            {!editando && (
              <input
                style={input}
                placeholder="Senha"
                type="password"
                value={form.senha}
                onChange={e=>setForm({...form,senha:e.target.value})}
              />
            )}

            <select
              style={input}
              value={form.perfil}
              onChange={e=>setForm({...form,perfil:e.target.value})}
            >
              <option value="Usuario">Usuário</option>
              <option value="Administrador">Administrador</option>
            </select>

            <select
              style={input}
              value={form.ativo}
              onChange={e=>setForm({...form,ativo:e.target.value})}
            >
              <option value="Sim">Ativo</option>
              <option value="Não">Inativo</option>
            </select>

            <div style={modalFooter}>
              <button style={btnIcon} onClick={()=>setOpen(false)}>Cancelar</button>
              <button style={btnPrimary} onClick={salvar}>Salvar</button>
            </div>

          </div>
        </div>
      )}

      {confirmar && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmar exclusão</h3>

            <p style={{marginTop:10}}>
              Excluir usuário <b>{confirmar.nome}</b>?
            </p>

            <div style={modalFooter}>
              <button style={btnIcon} onClick={()=>setConfirmar(null)}>Cancelar</button>
              <button style={btnDelete} onClick={excluir}>Excluir</button>
            </div>

          </div>
        </div>
      )}

      {log && (
        <div style={overlay}>
          <div style={modal}>

            <h3>Log do usuário</h3>

            <div style={{marginTop:10,lineHeight:'22px'}}>
              <div><b>ID:</b> {log.user_id}</div>
              <div><b>Nome:</b> {log.nome}</div>
              <div><b>Email:</b> {log.email}</div>
              <div><b>Perfil:</b> {log.perfil}</div>
              <div><b>Status:</b> {log.ativo}</div>
            </div>

            <div style={modalFooter}>
              <button style={btnPrimary} onClick={()=>setLog(null)}>Fechar</button>
            </div>

          </div>
        </div>
      )}

      {aviso && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Aviso</h3>
            <p style={{marginTop:10}}>{aviso}</p>
            <div style={modalFooter}>
              <button style={btnPrimary} onClick={()=>setAviso(null)}>OK</button>
            </div>
          </div>
        </div>
      )}

    </CrudLayout>
  )
}

const actions:CSSProperties={display:'flex',gap:10}

const btnPrimary:CSSProperties={
  background:'#16a34a',
  color:'#fff',
  padding:'8px 14px',
  borderRadius:6,
  border:'none'
}

const btnExcel:CSSProperties={
  background:'#166534',
  color:'#fff',
  padding:'8px 14px',
  borderRadius:6,
  border:'none'
}

const btnDark:CSSProperties={
  background:'#0b1a3a',
  color:'#fff',
  padding:'8px 14px',
  borderRadius:6,
  border:'none'
}

const btnIcon:CSSProperties={
  background:'#e5e7eb',
  border:'none',
  borderRadius:6,
  padding:'6px 10px'
}

const btnInfo:CSSProperties={
  background:'#0b1a3a',
  color:'#fff',
  border:'none',
  borderRadius:6,
  padding:'6px 10px'
}

const btnDelete:CSSProperties={
  background:'#dc2626',
  color:'#fff',
  border:'none',
  borderRadius:6,
  padding:'6px 10px'
}

const overlay:CSSProperties={
  position:'fixed',
  inset:0,
  background:'rgba(0,0,0,0.4)',
  display:'flex',
  justifyContent:'center',
  alignItems:'center'
}

const modal:CSSProperties={
  background:'#fff',
  borderRadius:12,
  width:380,
  padding:24,
  display:'flex',
  flexDirection:'column',
  gap:10
}

const modalFooter:CSSProperties={
  display:'flex',
  justifyContent:'flex-end',
  gap:10,
  marginTop:10
}

const input:CSSProperties={
  padding:8,
  border:'1px solid #ccc',
  borderRadius:6
}