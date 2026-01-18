import { Theme } from '@mui/material/styles';

import Alert from './Alert';
import Autocomplete from './Autocomplete';
import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Chip from './Chip';
import CssBaseline from './CssBaseline';
import Dialog from './Dialog';
import Form from './Form';
import IconButton from './IconButton';
import Input from './Input';
import Pagination from './Pagination';
import Paper from './Paper';
import Slider from './Slider';
import SvgIcon from './SvgIcon';
import Switch from './Switch';
import Table from './Table';
import Tabs from './Tabs';
import Tooltip from './Tooltip';

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    Alert(theme),
    Autocomplete(theme),
    Avatar(theme),
    Button(theme),
    Card(theme),
    Checkbox(theme),
    Chip(theme),
    CssBaseline(theme),
    Dialog(theme),
    Form(theme),
    Input(theme),
    Switch(theme),
    Slider(theme),
    Pagination(theme),
    Paper(theme),
    Table(theme),
    Tabs(theme),
    Tooltip(theme),
    IconButton(theme),
    SvgIcon()
  );
}
