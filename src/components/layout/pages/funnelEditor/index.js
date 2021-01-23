import { HashRouter } from 'react-router-dom'
import { Box } from '@material-ui/core'
import { useSelect } from '@wordpress/data'
import { useEffect, useState, useRef } from '@wordpress/element'
import { isEmpty, isUndefined } from 'lodash'


import { FUNNELS_STORE_NAME } from 'data/funnels'
import FunnelAppBar from './components/FunnelAppBar'
import ControlsCenter from './components/ControlsCenter'
import StepsPath from './components/StepsPath'
import './steps-types'

export const FunnelEditorNew = () => {

  const { ID } = window.Groundhogg.funnel

  const { funnel, isLoading } = useSelect( (select) => {
    const store = select(FUNNELS_STORE_NAME)
    return {
      funnel: store.getItem( ID ),
      isLoading: store.isItemsRequesting()
    }
  }, [ID] )

  // console.debug(funnel)

  const editorRef = useRef(null);
  const [editorWidth, setEditorWidth] = useState(null)

  useEffect(() => {
    // console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setEditorWidth(editorRef.current ? editorRef.current.offsetWidth : 0)
  }, [editorRef.current]);

  const showLoader = isLoading || isUndefined(funnel) || isEmpty(funnel)

  return (
    <HashRouter>
      <div className={'editor-wrap'} ref={editorRef}>
        { showLoader && <div>Loading...</div> }
        {! showLoader && <FunnelAppBar funnel={funnel} width={editorWidth}/>}
        <div className={''}>
          {! showLoader && <ControlsCenter funnel={funnel}/>}
        </div>
      </div>
    </HashRouter>
  )
}