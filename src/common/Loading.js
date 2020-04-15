import React from 'react';
import {Spinner} from 'reactstrap';

const Loading = () => {
  return (    
    <div>
      <Spinner type="grow" color="info" />
      <Spinner type="grow" color="info" />
      <Spinner type="grow" color="info" />
    </div>
  );
}

export default Loading;
