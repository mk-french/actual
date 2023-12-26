import { useLocation } from 'react-router-dom';

import * as monthUtils from 'loot-core/src/shared/months';

import ArrowLeft from '../../icons/v1/ArrowLeft';
import { styles } from '../../style';
import Button from '../common/Button';
import ButtonLink from '../common/ButtonLink';
import Select from '../common/Select';
import View from '../common/View';
import { FilterButton, AppliedFilters } from '../filters/FiltersMenu';

export function validateStart(allMonths, start, end, forecast) {
  const earliest = allMonths[allMonths.length - 1].name;
  if (end < start) {
    end = monthUtils.addMonths(start, 6);
  }
  return boundedRange(earliest, start, end, forecast);
}

export function validateEnd(allMonths, start, end, forecast) {
  const earliest = allMonths[allMonths.length - 1].name;
  if (start > end) {
    start = monthUtils.subMonths(end, 6);
  }
  return boundedRange(earliest, start, end);
}

function validateForecast(allMonths, start, end, forecast) {
  const earliest = allMonths[allMonths.length - 1].name;
  return boundedRange(earliest, start, end, forecast);
}

export function validateRange(allMonths, start, end) {
  const latest = monthUtils.currentMonth();
  const earliest = allMonths[allMonths.length - 1].name;
  if (end > latest) {
    end = latest;
  }
  if (start < earliest) {
    start = earliest;
  }
  return [start, end];
}

function boundedRange(earliest, start, end, forecast) {
  const latest = monthUtils.currentMonth();
  if (end > latest) {
    end = latest;
  }
  if (start < earliest) {
    start = earliest;
  }
  if (end != latest) {
    forecast = latest;
  }
  return [start, end, forecast];
}

export function getLatestRange(offset, forecast) {
  const end = monthUtils.currentMonth();
  const start = monthUtils.subMonths(end, offset);
  return [start, end, forecast];
}

export function getFullRange(allMonths, forecast) {
  const start = allMonths[allMonths.length - 1].name;
  const end = monthUtils.currentMonth();
  return [start, end, forecast];
}

function Header({
  title,
  start,
  end,
  forecast,
  show1Month,
  allMonths,
  allForecasts,
  disabled,
  onChangeDates,
  filters,
  conditionsOp,
  onApply,
  onUpdateFilter,
  onDeleteFilter,
  onCondOpChange,
  headerPrefixItems,
  selectGraph,
}) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <View
      style={{
        padding: 10,
        paddingTop: 0,
        flexShrink: 0,
      }}
    >
      <ButtonLink
        type="bare"
        to="/reports"
        style={{ marginBottom: '15', alignSelf: 'flex-start' }}
      >
        <ArrowLeft width={10} height={10} style={{ marginRight: 5 }} /> Back
      </ButtonLink>
      <View style={styles.veryLargeText}>{title}</View>

      {path !== '/reports/custom' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            gap: 15,
          }}
        >
          {headerPrefixItems}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Select
              onChange={newValue =>
                onChangeDates(...validateStart(allMonths, newValue, end, forecast))
              }
              value={start}
              defaultLabel={monthUtils.format(start, 'MMMM, yyyy')}
              options={allMonths.map(({ name, pretty }) => [name, pretty])}
            />
            <View>to</View>
            <Select
              onChange={newValue =>
                onChangeDates(...validateEnd(allMonths, start, newValue, forecast))
              }
              value={end}
              options={allMonths.map(({ name, pretty }) => [name, pretty])}
            />
            {forecast && <View>+</View>}
            {forecast && <Select
              style={{ backgroundColor: 'white' }}
              onChange={newValue =>
                onChangeDates(...validateForecast(allMonths, start, end, newValue))
              }
              value={forecast}
              options={allForecasts.map(({ name, pretty }) => [name, pretty])}
              disabledKeys={disabled}
            />}
          </View>

          {filters && <FilterButton onApply={onApply} type="accounts" />}

          {show1Month && (
            <Button
              type="bare"
              onClick={() => onChangeDates(...getLatestRange(1, forecast))}
            >
              1 month
            </Button>
          )}
          <Button
            type="bare"
            onClick={() => onChangeDates(...getLatestRange(2, forecast))}
          >
            3 months
          </Button>
          <Button
            type="bare"
            onClick={() => onChangeDates(...getLatestRange(5, forecast))}
          >
            6 months
          </Button>
          <Button
            type="bare"
            onClick={() => onChangeDates(...getLatestRange(11, forecast))}
          >
            1 Year
          </Button>
          <Button
            type="bare"
            onClick={() => onChangeDates(...getFullRange(allMonths, forecast))}
          >
            All Time
          </Button>
          <View style={{ flex: 1 }} />
        </View>
      )}
      {filters && filters.length > 0 && (
        <View
          style={{ marginTop: 5 }}
          spacing={2}
          direction="row"
          justify="flex-start"
          align="flex-start"
        >
          <AppliedFilters
            filters={filters}
            onUpdate={onUpdateFilter}
            onDelete={onDeleteFilter}
            conditionsOp={conditionsOp}
            onCondOpChange={onCondOpChange}
          />
        </View>
      )}
    </View>
  );
}

export default Header;
