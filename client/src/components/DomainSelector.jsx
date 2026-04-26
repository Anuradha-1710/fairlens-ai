import React from 'react';
import '../styles/Components.css';

export default function DomainSelector({ selectedDomain, onSelect }) {
  const domains = [
    {
      id: 'hiring',
      name: 'Hiring Decisions',
      icon: '👔',
      description: 'Detect gender, age, and racial bias in recruitment'
    },
    {
      id: 'loan',
      name: 'Loan Approvals',
      icon: '💰',
      description: 'Identify discriminatory lending patterns'
    },
    {
      id: 'medical',
      name: 'Medical Care',
      icon: '⚕️',
      description: 'Detect healthcare disparities and treatment bias'
    }
  ];

  return (
    <div className="domain-selector-container">
      {domains.map(domain => (
        <div
          key={domain.id}
          className={`domain-card ${selectedDomain === domain.id ? 'selected' : ''}`}
          onClick={() => onSelect(domain.id)}
        >
          <div className="domain-icon">{domain.icon}</div>
          <h3>{domain.name}</h3>
          <p>{domain.description}</p>
        </div>
      ))}
    </div>
  );
}
