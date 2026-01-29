import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Vinculacao } from './vinculacao.entity'
import { FuncaoEntity } from '../funcao/funcao.entity'
import { DepartamentoEntity } from '../departamento/departamento.entity'
import { UsuarioEntity } from '../usuario/usuario.entity'

@Injectable()
export class VinculacaoService {
  constructor(
    @InjectRepository(Vinculacao)
    private readonly vinculacaoRepo: Repository<Vinculacao>,

    @InjectRepository(FuncaoEntity)
    private readonly funcaoRepo: Repository<FuncaoEntity>,

    @InjectRepository(DepartamentoEntity)
    private readonly departamentoRepo: Repository<DepartamentoEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepo: Repository<UsuarioEntity>,
  ) {}

  async getHierarquia(empresaId: number) {
    const rows = await this.vinculacaoRepo.query(
      `
      SELECT 
        d.dpto_id,
        d.nome AS departamento,
        f.func_id,
        f.nome AS funcao,
        u.user_id,
        u.nome AS usuario,
        v.percentual_alocacao
      FROM tb_vinculacao v
      JOIN tb_departamentos d 
        ON d.dpto_id = v.dpto_id 
       AND d.idtb_empresas = v.empresa_id
      JOIN tb_funcao f 
        ON f.func_id = v.func_id 
       AND f.idtb_empresas = v.empresa_id
      JOIN tb_usuario u 
        ON u.user_id = v.user_id 
       AND u.idtb_empresas = v.empresa_id
      WHERE v.empresa_id = $1
        AND v.excluido = 'Nao'
        AND d.excluido = 'Não'
        AND f.excluido = 'Nao'
        AND u.excluido = 'Não'
      ORDER BY d.nome, f.nome, u.nome
      `,
      [empresaId],
    )

    const map = new Map<number, any>()

    for (const r of rows) {
      if (!map.has(r.dpto_id)) {
        map.set(r.dpto_id, {
          dpto_id: r.dpto_id,
          nome: r.departamento,
          funcoes: [],
        })
      }

      const dpto = map.get(r.dpto_id)

      let func = dpto.funcoes.find(
        (f: any) => f.func_id === r.func_id,
      )

      if (!func) {
        func = {
          func_id: r.func_id,
          nome: r.funcao,
          usuarios: [],
        }
        dpto.funcoes.push(func)
      }

      func.usuarios.push({
        user_id: r.user_id,
        nome: r.usuario,
        percentual_alocacao: r.percentual_alocacao,
      })
    }

    return Array.from(map.values())
  }

  async getCombos(empresaId: number) {
    const departamentos = await this.departamentoRepo.find({
      where: {
        idtb_empresas: empresaId,
        excluido: 'Não',
      },
      order: { nome: 'ASC' },
    })

    const funcoes = await this.funcaoRepo.find({
      where: {
        idtb_empresas: empresaId,
        excluido: 'Nao',
      },
      order: { nome: 'ASC' },
    })

    const usuarios = await this.usuarioRepo.find({
      where: {
        idtb_empresas: empresaId,
        excluido: 'Não',
      },
      order: { nome: 'ASC' },
      select: ['user_id', 'nome'],
    })

    return {
      departamentos,
      funcoes,
      usuarios,
    }
  }

  async criar(
    data: {
      dpto_id: number
      func_id: number
      user_id: string
      percentual_alocacao: number
    },
    empresaId: number,
    userLog: string,
  ) {
    const vinc = this.vinculacaoRepo.create({
      ...data,
      empresa_id: empresaId,
      user_id_log: userLog,
      excluido: 'Nao',
    })

    return this.vinculacaoRepo.save(vinc)
  }
}
