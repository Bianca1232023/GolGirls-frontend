import React from 'react'
import Logo from '../components/icons/logo'
import AcessCard from '../components/AcessCard'

export function InitialPage() {
  return (
    <div className= 'main'>
        <Logo className="logo" />
        <h1 className='title'>Bem-vinda ao GolGirls</h1>
        <span className='subtitle'>Selecione seu tipo de acesso</span>

        <AcessCard role="aluno" />
        <AcessCard role="professor" />
        <AcessCard role="admin" />

    </div>
  )
}
