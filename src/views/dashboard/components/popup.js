import * as React from 'react';

function CityInfo(props) {
  const {info} = props;
  const displayName = `${info.project_number}}, ${info.project_number}}`;

  return (
    <div>
      <div>
        {displayName} |{' '}
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}
        >
          Wikipedia
        </a>
      </div>
      <span>{info.project_number}</span>
    </div>
  );
}

export default React.memo(CityInfo);