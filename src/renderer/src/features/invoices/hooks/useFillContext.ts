import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
// import { StatsContext } from '@/pages/Stats/context/context';
import { Report } from 'entities/index';
import * as React from 'react';

export const useFillContext = ({
  context,
  reinvoice
}: {
  context: React.Context<any>;
  reinvoice?:
    | {
        report: Report;
      }
    | boolean;
}) => {
  const {
    setActions,
    actions: contextActions,
    setAutoParts,
    autoparts: contextAutoParts,
    setConfirm
  } = React.useContext(context);

  React.useEffect(() => {
    if (reinvoice) {
      const { report } = reinvoice as { report: Report };
      const { actions_prices, details_prices } = {
        actions_prices: JSON.parse(report.invoice.actions_prices) as IActionState[],
        details_prices: JSON.parse(report.invoice.details_prices) as IAutoPartState[]
      };
      /**
       * Real time data
       */
      const actual_report_autoparts = report.report_autoparts.map(({ autopart: { id } }) => id);
      const actual_report_services = report.report_services.map(({ service: { id } }) => id);
      /**
       * Set data into services context
       */
      actions_prices.forEach((service) => {
        if (actual_report_services.includes(service.id))
          setActions((actions) => [
            ...actions,
            { id: service.id, price: service.price, name: service.name }
          ]);
      });
      /**
       * Set data into auto-parts context
       */
      details_prices.forEach((part) => {
        if (actual_report_autoparts.includes(part.id)) {
          setAutoParts((autoparts) => [
            ...autoparts,
            {
              id: part.id,
              price: part.price,
              name: part.name,
              quantity: part.quantity,
              code: part.code
            }
          ]);
        }
      });
    }
    // Don't clear the context data on unmount - it's needed for the confirmation dialog
    // The context will be cleared by the confirmation dialog itself after successful invoice creation
  }, []);

  React.useEffect(() => {
    setConfirm({ actions: contextActions, autoparts: contextAutoParts });
  }, [contextActions, contextAutoParts]);

  /**
   * Set Service Price
   */
  const setActionPrice = React.useCallback(
    ({ id, price, name }: IActionState) => {
      const numericPrice = Number(price);
      if (contextActions.filter((cA) => cA.id === id).length === 0) {
        return setActions((actions) => [...actions, { id, price: numericPrice, name }]);
      }
      return setActions((actions) => {
        return actions.map((_) => {
          if (_.id === id) return { ..._, price: numericPrice };
          return _;
        });
      });
    },
    [contextActions]
  );
  /**
   * Set Auto Parts Price
   */
  const setAutoPartPrice = React.useCallback(
    ({ id, price, name, quantity, code }: IAutoPartState) => {
      const numericPrice = Number(price);
      const numericQuantity = Number(quantity);
      if (contextAutoParts.filter((cA) => cA.id === id).length === 0) {
        return setAutoParts((autoparts) => [
          ...autoparts,
          {
            id,
            price: numericPrice,
            name,
            quantity: numericQuantity,
            code
          }
        ]);
      }
      return setAutoParts((autoparts) => {
        return autoparts.map((_) => {
          if (_.id === id) return { ..._, price: numericPrice };
          return _;
        });
      });
    },
    [contextAutoParts]
  );

  return { setActionPrice, setAutoPartPrice, contextActions, contextAutoParts };
};
