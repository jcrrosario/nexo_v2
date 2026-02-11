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
        v.vinculacao_id,
        v.percentual_alocacao,
        v.custo_mensal
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
        AND (v.excluido IS NULL OR v.excluido <> 'Sim')
        AND (d.excluido IS NULL OR d.excluido <> 'Sim')
        AND (f.excluido IS NULL OR f.excluido <> 'Sim')
        AND (u.excluido IS NULL OR u.excluido <> 'Sim')
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
        vinculacao_id: r.vinculacao_id,
        user_id: r.user_id,
        nome: r.usuario,
        percentual_alocacao: Number(r.percentual_alocacao),
        custo_mensal: Number(r.custo_mensal),
      })
    }

    return Array.from(map.values())
  }

  async getCombos(empresaId: number) {
    const departamentos = await this.departamentoRepo
      .createQueryBuilder('d')
      .where('d.idtb_empresas = :empresaId', { empresaId })
      .andWhere("(d.excluido IS NULL OR d.excluido <> 'Sim')")
      .orderBy('d.nome', 'ASC')
      .getMany()

    const funcoes = await this.funcaoRepo
      .createQueryBuilder('f')
      .where('f.idtb_empresas = :empresaId', { empresaId })
      .andWhere("(f.excluido IS NULL OR f.excluido <> 'Sim')")
      .orderBy('f.nome', 'ASC')
      .getMany()

    const usuarios = await this.usuarioRepo
      .createQueryBuilder('u')
      .where('u.idtb_empresas = :empresaId', { empresaId })
      .andWhere("(u.excluido IS NULL OR u.excluido <> 'Sim')")
      .orderBy('u.nome', 'ASC')
      .select(['u.user_id', 'u.nome'])
      .getMany()

    return {
      departamentos,
      funcoes,
      usuarios,
    }
  }

  async criar(data: any, empresaId: number, userLog: string) {
    const vinc = this.vinculacaoRepo.create({
      empresa_id: empresaId,
      dpto_id: Number(data.dpto_id),
      func_id: Number(data.func_id),
      user_id: String(data.user_id),
      percentual_alocacao: Number(data.percentual_alocacao),
      custo_mensal: data.custo_mensal
        ? Number(data.custo_mensal)
        : 0,
      user_id_log: userLog,
      excluido: 'Nao',
    })

    return this.vinculacaoRepo.save(vinc)
  }

  async atualizar(id: number, data: any, empresaId: number, userLog: string) {
    await this.vinculacaoRepo.update(
      { vinculacao_id: id, empresa_id: empresaId },
      {
        percentual_alocacao: Number(data.percentual_alocacao),
        custo_mensal: data.custo_mensal
          ? Number(data.custo_mensal)
          : 0,
        user_id_log: userLog,
      },
    )

    return { ok: true }
  }

  async excluir(id: number, empresaId: number, userLog: string) {
    await this.vinculacaoRepo.update(
      { vinculacao_id: id, empresa_id: empresaId },
      {
        excluido: 'Sim',
        user_id_log: userLog,
      },
    )

    return { ok: true }
  }
}
