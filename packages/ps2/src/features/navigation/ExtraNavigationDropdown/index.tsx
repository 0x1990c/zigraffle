import {
  IconButton,
  DropDown,
  OptionHorizontalDotsIcon,
} from '@zignaly-open/ui';
import React, { useCallback, useRef } from 'react';
import { useTheme } from 'styled-components';
import Theme from '@zignaly-open/ui/lib/theme/theme';
import { DropDownContainer, NavLink, NavList, Networks } from './styles';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from 'react-i18next';
import socialNetworksLinks from '../../../util/socialNetworks';
import { supportedLanguages } from '../../../util/i18next';
import { useChangeLocale } from '../../auth/use';
import { useTraderServices } from '../../trader/use';
import { generatePath, Link } from 'react-router-dom';
import { ROUTE_HELP, ROUTE_TRADING_SERVICE_MANAGE } from '../../../routes';
import { DropDownHandle } from '@zignaly-open/ui/lib/components/display/DropDown/types';

const ExtraNavigationDropdown: React.FC = () => {
  const theme = useTheme() as Theme;
  const dropDownRef: React.Ref<DropDownHandle> = useRef(null);
  const { t, i18n } = useTranslation('common');

  const onClose = useCallback(() => {
    dropDownRef.current?.closeDropDown();
  }, [dropDownRef]);

  const changeLocale = useChangeLocale();
  const services = useTraderServices();

  const onSelectLocale = (locale: string) => {
    changeLocale(locale);
    onClose();
  };

  return (
    <DropDown
      ref={dropDownRef}
      component={
        <IconButton
          variant={'flat'}
          icon={
            <OptionHorizontalDotsIcon
              width={14}
              height={4}
              color={theme.neutral300}
            />
          }
          key={'user'}
        />
      }
      content={
        <DropDownContainer>
          <NavList>
            <Link
              onClick={onClose}
              to={
                services?.[0]
                  ? generatePath(ROUTE_TRADING_SERVICE_MANAGE, {
                      serviceId: services[0].serviceId?.toString(),
                    })
                  : ROUTE_HELP
              }
            >
              <NavLink>{t('main-menu.dropdown-link-forTrading')}</NavLink>
            </Link>
          </NavList>

          <NavList>
            <NavLink
              as={'a'}
              href={'https://help.zignaly.com/hc/en-us'}
              target={'_blank'}
              onClick={onClose}
            >
              {t('main-menu.dropdown-link-helpDocs')}
            </NavLink>
            {/* <NavLink disabled={true}>
                    <Bold>ZIG</Bold> $0.0514
                  </NavLink> */}
          </NavList>
          <NavList className={'last'}>
            <LanguageSelector
              selectedLocale={i18n.language}
              supportedLocales={supportedLanguages}
              onSelectLocale={onSelectLocale}
            />
          </NavList>
          <Networks>
            {socialNetworksLinks.map((socialNetwork, index) => {
              const IconComponent = socialNetwork.image;
              return (
                <NavLink
                  as={'a'}
                  onClick={onClose}
                  href={socialNetwork.path}
                  key={`--social-network-nav-link-${index.toString()}`}
                  target={'_blank'}
                >
                  <IconComponent height={'22px'} width={'22px'} />
                </NavLink>
              );
            })}
          </Networks>
        </DropDownContainer>
      }
    />
  );
};

export default ExtraNavigationDropdown;
