import Buttons from './Buttons.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import NewTodo from './NewTodo.react';
import React from 'react';
import Todos from './Todos.react';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(linksMessages.todos);

    return (
      <div className="todos-page">
        <Helmet title={title} />
        <NewTodo />
        <Todos />
        <Buttons />
      </div>
    );
  }

}

export default injectIntl(Page);
