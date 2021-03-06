/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { copyQualityGate } from '../../../api/quality-gates';
import ConfirmButton from '../../../components/controls/ConfirmButton';
import { Button } from '../../../components/ui/buttons';
import { translate } from '../../../helpers/l10n';
import { getQualityGateUrl } from '../../../helpers/urls';
import { QualityGate } from '../../../app/types';

interface Props {
  onCopy: () => Promise<void>;
  organization?: string;
  qualityGate: QualityGate;
}

interface State {
  name: string;
}

export default class CopyQualityGateForm extends React.PureComponent<Props, State> {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props: Props) {
    super(props);
    this.state = { name: props.qualityGate.name };
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.currentTarget.value });
  };

  onCopy = () => {
    const { qualityGate, organization } = this.props;
    const { name } = this.state;

    if (!name) {
      return undefined;
    }

    return copyQualityGate({ id: qualityGate.id, name, organization }).then(qualityGate => {
      this.props.onCopy();
      this.context.router.push(getQualityGateUrl(String(qualityGate.id), this.props.organization));
    });
  };

  render() {
    const { qualityGate } = this.props;
    const { name } = this.state;
    const confirmDisable = !name || (qualityGate && qualityGate.name === name);

    return (
      <ConfirmButton
        confirmButtonText={translate('copy')}
        confirmDisable={confirmDisable}
        modalBody={
          <div className="modal-field">
            <label htmlFor="quality-gate-form-name">
              {translate('name')}
              <em className="mandatory">*</em>
            </label>
            <input
              autoFocus={true}
              id="quality-gate-form-name"
              maxLength={100}
              onChange={this.handleNameChange}
              required={true}
              size={50}
              type="text"
              value={name}
            />
          </div>
        }
        modalHeader={translate('quality_gates.copy')}
        onConfirm={this.onCopy}>
        {({ onClick }) => (
          <Button className="little-spacer-left" id="quality-gate-copy" onClick={onClick}>
            {translate('copy')}
          </Button>
        )}
      </ConfirmButton>
    );
  }
}
