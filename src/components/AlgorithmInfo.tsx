import React from 'react';
import type { AlgorithmInfo as AlgorithmInfoType } from '../core/types';

interface AlgorithmInfoProps {
  info: AlgorithmInfoType;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ info }) => {
  return (
    <div className="algorithm-info">
      <div className="algorithm-info-header">
        <h3 className="algorithm-info-name">{info.name}</h3>
        <span
          className={`badge ${info.preemptive ? 'badge-preemptive' : 'badge-non-preemptive'}`}
        >
          {info.preemptive ? 'Preemptive' : 'Non-preemptive'}
        </span>
      </div>

      <p className="algorithm-info-description">{info.description}</p>

      <div className="algorithm-info-lists">
        <div className="algorithm-info-pros">
          <h4>Pros</h4>
          <ul>
            {info.pros.map((pro, index) => (
              <li key={index}>
                <span className="list-icon pro-icon">✓</span> {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="algorithm-info-cons">
          <h4>Cons</h4>
          <ul>
            {info.cons.map((con, index) => (
              <li key={index}>
                <span className="list-icon con-icon">✗</span> {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
