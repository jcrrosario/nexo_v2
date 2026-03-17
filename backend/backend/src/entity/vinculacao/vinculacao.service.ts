import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DepartamentoEntity } from '../departamento/departamento.entity'

@Injectable()
export class VinculacaoService {
  constructor(
    @InjectRepository(DepartamentoEntity)
    private readonly departamentoRepo: Repository<DepartamentoEntity>,
  ) {}

  async getHierarquia(empresaId: number) {
    const rows = await this.departamentoRepo.query(
      `
      SELECT
        COALESCE(d.dpto_id, 0) AS dpto_id,
        COALESCE(d.nome, 'Sem departamento') AS departamento,
        COALESCE(f.func_id, 0) AS func_id,
        COALESCE(f.nome, 'Sem função') AS funcao,
        fn.funcionario_id,
        fn.nome_completo,
        COALESCE(fn.salario_bruto, 0) AS salario_bruto,
        COALESCE(fn.encargos, 0) AS encargos,
        COALESCE(fn.provisoes, 0) AS provisoes,
        COALESCE(fn.beneficios, 0) AS beneficios
      FROM tb_funcionarios fn
      INNER JOIN tb_empresas e
        ON e.empresa_id = fn.idtb_empresas
      LEFT JOIN tb_departamentos d
        ON d.dpto_id = fn.dpto_id
       AND d.idtb_empresas = fn.idtb_empresas
      LEFT JOIN tb_funcao f
        ON f.func_id = fn.funcao_id
       AND f.idtb_empresas = fn.idtb_empresas
      WHERE fn.idtb_empresas = $1
        AND (fn.excluido IS NULL OR fn.excluido <> 'Sim')
        AND (e.ativa IS NULL OR e.ativa <> 'Nao')
        AND (d.dpto_id IS NULL OR d.excluido IS NULL OR d.excluido <> 'Sim')
        AND (f.func_id IS NULL OR f.excluido IS NULL OR f.excluido <> 'Sim')
      ORDER BY
        COALESCE(d.nome, 'Sem departamento'),
        COALESCE(f.nome, 'Sem função'),
        fn.nome_completo
      `,
      [empresaId],
    )

    const mapaDepartamentos = new Map<number, any>()

    for (const row of rows) {
      const salarioBruto = Number(row.salario_bruto || 0)
      const encargos = Number(row.encargos || 0)
      const provisoes = Number(row.provisoes || 0)
      const beneficios = Number(row.beneficios || 0)
      const custoTotal =
        salarioBruto + encargos + provisoes + beneficios

      if (!mapaDepartamentos.has(Number(row.dpto_id))) {
        mapaDepartamentos.set(Number(row.dpto_id), {
          dpto_id: Number(row.dpto_id),
          nome: row.departamento,
          total_funcionarios: 0,
          total_salario_bruto: 0,
          total_encargos: 0,
          total_provisoes: 0,
          total_beneficios: 0,
          total_custo: 0,
          funcoes: [],
        })
      }

      const departamento = mapaDepartamentos.get(Number(row.dpto_id))

      let funcao = departamento.funcoes.find(
        (item: any) => item.func_id === Number(row.func_id),
      )

      if (!funcao) {
        funcao = {
          func_id: Number(row.func_id),
          nome: row.funcao,
          total_funcionarios: 0,
          total_salario_bruto: 0,
          total_encargos: 0,
          total_provisoes: 0,
          total_beneficios: 0,
          total_custo: 0,
          usuarios: [],
        }

        departamento.funcoes.push(funcao)
      }

      funcao.usuarios.push({
        funcionario_id: Number(row.funcionario_id),
        nome: row.nome_completo,
        salario_bruto: salarioBruto,
        encargos,
        provisoes,
        beneficios,
        custo_total: custoTotal,
      })

      funcao.total_funcionarios += 1
      funcao.total_salario_bruto += salarioBruto
      funcao.total_encargos += encargos
      funcao.total_provisoes += provisoes
      funcao.total_beneficios += beneficios
      funcao.total_custo += custoTotal

      departamento.total_funcionarios += 1
      departamento.total_salario_bruto += salarioBruto
      departamento.total_encargos += encargos
      departamento.total_provisoes += provisoes
      departamento.total_beneficios += beneficios
      departamento.total_custo += custoTotal
    }

    return Array.from(mapaDepartamentos.values())
  }
}