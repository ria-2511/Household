import { useAppDispatch, useAppSelector } from '../../store';
import { setTheme, showToast } from '../../store/slices/uiSlice';
import { saveTheme } from '../../store/slices/configSlice';
import { THEME_OPTIONS } from '../../data';
import './ThemePicker.scss';

const ThemePicker = () => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppSelector((state) => state.ui.theme);

  const selectTheme = async (id) => {
    dispatch(setTheme(id));
    const result = await dispatch(saveTheme(id));
    if (saveTheme.fulfilled.match(result)) {
      dispatch(showToast('Theme updated'));
    } else if (saveTheme.rejected.match(result)) {
      dispatch(showToast(result.payload || 'Failed to save theme'));
    }
  };

  return (
    <div className="theme-picker">
      <h3 className="theme-picker__title">App Theme</h3>
      <p className="theme-picker__hint">Tap a theme to preview it live across the whole app.</p>
      <div className="theme-picker__grid">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => selectTheme(theme.id)}
            className={`theme-picker__option ${activeTheme === theme.id ? 'theme-picker__option--active' : ''}`}
            data-theme-preview={theme.id}
          >
            <span className="theme-picker__swatches">
              <span className="theme-picker__swatch theme-picker__swatch--bg" />
              <span className="theme-picker__swatch theme-picker__swatch--primary" />
              <span className="theme-picker__swatch theme-picker__swatch--secondary" />
            </span>
            <span className="theme-picker__label">{theme.name}</span>
            <span className="theme-picker__desc">{theme.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;
