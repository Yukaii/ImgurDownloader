/*
 * schema:
 *
 * "id": "LPySUCH",
 * "title": "Episode 1",
 * "description": "Artist: Yuuki Hagure http://myanimelist.net/people/22227/Hagure_Yuuki",
 * "datetime": 1444440612,
 * "type": "image/png",
 * "animated": false,
 * "width": 1280,
 * "height": 720,
 * "size": 1146833,
 * "views": 7620,
 * "bandwidth": 8738867460,
 * "vote": null,
 * "favorite": false,
 * "nsfw": null,
 * "section": null,
 * "account_url": null,
 * "account_id": null,
 * "comment_preview": null,
 * "link": "http://i.imgur.com/LPySUCH.png",
 * "thumbnail": "http://i.imgur.com/LPySUCHt.png",
 * "progress": 0
 */

import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

import { shell } from 'electron';

import styles from './Image.module.css';

export default class Image extends Component {
  constructor(props) {
    super(props);
    this.state = { contentVisible: true }
  }

  handleBoxClick = () => {
    this.setState({contentVisible: !this.state.contentVisible});
  }

  handleLinkClick = () => {
    const { imageData } = this.props;
    shell.openExternal(imageData.link);
    setTimeout(() => {
      // weird, anchor click would leads to trigger handleBoxClick action to
      // toggle content visibility to false, so I set back contentVisible to false
      this.setState({contentVisible: true});
    }, 400);
  }

  render() {
    const { imageData } = this.props;
    var percentage = typeof imageData.progress === 'undefined' ? 0 : imageData.progress;

    var hiddenToggleStyle = {
      opacity: this.state.contentVisible ? 1 : 0,
      zIndex: this.state.contentVisible ? 3 : 1
    }

    return(
      <div className={styles.imageBox} onClick={this.handleBoxClick}>
        <div className={styles.thumbnail} style={{backgroundImage: `url(${imageData.thumbnail})`}}/>
        <Motion style={{x: spring(percentage) }}>
          {({x}) =>
            <div className={styles.progress}
                 style={{
                   opacity: this.state.contentVisible ? 1 : 0,
                   width: `${x}%`,
                 }}/>
          }
        </Motion>
        <div className={styles.content} style={hiddenToggleStyle}>
          <div className={`${styles.title}`}>{imageData.title}</div>
          <div className="description">{imageData.description}</div>
          <a onClick={this.handleLinkClick} className="link">{imageData.link}</a>
        </div>
      </div>
    )
  }
}
