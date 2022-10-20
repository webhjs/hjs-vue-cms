/**
 * @Description:
 * @Author bianpengfei
 * @create 2022/7/1 14:01
 */
console.log(BSE)
const { domUtils } = window.BSE

/****************************************开始*******************************************/
/**
 * 获取第一个子节点
 * @param node
 * @returns {*}
 * @deprecated
 */
const getFirstBlockChildNode = node => {
  let result
  if (node.nodeType == 1 || !BSE.domUtils.isZeroWidthNode(node)) {
    const childNodes = Array.from(node.childNodes)
    for (let i = 0; i < childNodes.length; i++) {
      let item = childNodes[i]
      if (item.nodeType == 1) {
        if (BSE.domUtils.isBlockElm(item)) {
          if (BSE.domUtils.isEmptyBlock(item) && BSE.dtd.$tableContent[domUtils.getTagName()]) {
            item.remove()
          } else {
            result = item
            break
          }
        } else {
          const p = document.createElement('p')
          item.insertAdjacentElement('beforebegin', p)
          p.append(item)
          result = p
          break
        }
      } else if (item.nodeType == 3) {
        if (!item.textContent.trim()) {
          item.remove()
        } else {
          const p = document.createElement('p')
          node.insertBefore(p, item)
          p.append(item)
          result = p
          break
        }
      }
    }
  } else if (node.nodeType == 3) {
    result = node.textContent.at(-1)
  }
  return result
}

/**
 * 获取最后的一个子节点
 * @param node
 * @returns {*}
 */
const getLastBlockChildNode = node => {
  let result
  if (node.nodeType == 1 || !BSE.domUtils.isZeroWidthNode(node)) {
    const childNodes = Array.from(node.childNodes)
    for (let i = childNodes.length - 1; i >= 0; i--) {
      let item = childNodes[i]
      if (item.nodeType == 1) {
        if (BSE.domUtils.isBlockElm(item)) {
          if (BSE.domUtils.isEmptyBlock(item) && BSE.dtd.$tableContent[domUtils.getTagName()]) {
            item.remove()
          } else {
            result = item
            break
          }
        } else {
          const p = document.createElement('p')
          item.insertAdjacentElement('beforebegin', p)
          p.append(item)
          result = p
          break
        }
      } else if (item.nodeType == 3) {
        if (!item.textContent.trim()) {
          item.remove()
        } else {
          const p = document.createElement('p')
          node.insertBefore(p, item)
          p.append(item)
          result = p
          break
        }
      }
    }
  } else if (node.nodeType == 3) {
    result = node.textContent.at(-1)
  }
  return result
}

/**
 * 判断是否是空 块级 节点
 * @param node
 */
const isEmptyBlockEle = node => {
  let condition1 = !node.childNodes.length,
    condition2 = !node.textContent.trim(),
    condition3 =
      node.childNodes.length == 1 &&
      (!node.childNodes[0].textContent.trim() || BSE.domUtils.isZeroWidthNode(node.childNodes[0])),
    condition4 = BSE.domUtils.isEmptyBlock(node)
  return (
    BSE.domUtils.isBlockElm(node) &&
    !BSE.dtd.$inline[BSE.domUtils.getTagName(node)] &&
    (condition1 || condition2 || condition3 || condition4)
  )
}

/**
 * 判断光标是否处于最后
 * @param range
 * @param target
 */
const isCursorEnd = (range, target) => {
  let isEnd = true
  let treeWalker
  console.log('isCursorEnd@4', range.endContainer, range.endOffset)
  if (range.endContainer.nodeType == 1) {
    // 元素
    treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_ALL, {
      acceptNode: node => {
        if (
          [1, 3].includes(node.nodeType) &&
          node.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_PRECEDING &&
          node.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS
        ) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_REJECT
      }
    })
  } else if (range.endContainer.nodeType == 3) {
    // 文本
    console.log('isCursorEnd@2', range.endContainer.textContent.length, range.endOffset)
    if (range.endContainer.textContent.length <= range.endOffset) {
      // 处于末尾
      treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_ALL, {
        acceptNode: node => {
          if (
            [1, 3].includes(node.nodeType) &&
            node.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_PRECEDING &&
            node.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS
          ) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      })
    }
  }

  console.log('isCursorEnd@3', treeWalker)

  if (treeWalker) {
    // 遍历注释节点和换行文本节点
    while (treeWalker.nextNode()) {
      let cNode = treeWalker.currentNode
      console.log('isCursorEnd@1', cNode)
      if (cNode.nodeType == 1) {
        if (cNode.clientWidth && cNode.clientHeight) {
          isEnd = false
          break
        }
      } else if (cNode.nodeType == 3) {
        console.log('isCursorEnd@4', cNode.textContent.trim(), domUtils.isZeroWidthNode(cNode))
        if (cNode.textContent.trim() && !domUtils.isZeroWidthNode(cNode)) {
          isEnd = false
          break
        }
      }
    }
    // console.log('range.endContainer@2', isEnd)
  } else {
    isEnd = false
  }
  return isEnd
}

/**
 * 判断光标是否处于开头 TODO
 * @param range
 */
const isCursorStart = range => {
  let isStart = false
  if (range.startContainer.nodeType == 1 && range.startOffset == 0) {
    // 元素
    isStart = true
  } else if (range.startContainer.nodeType == 3) {
    // 文本
    if (range.startOffset == 0) {
      // 处于开头
      isStart = true
    }
  }
  return isStart
}

/**
 * 根据每一个rangeItem对象，从顶部父节点一直创建到当前的节点合并
 * @param rangeItem
 * @param options
 * @returns {DocumentFragment|NULL|DocumentFragment|*|null}
 */
const createElementFullFragment = (rangeItem = {}, options = {}) => {
  let result
  let innerPNode
  options = BSE.utils.merge({ filter: null, includeSelf: false }, options)
  let idx = rangeItem.parentNodesList.findIndex(v => {
    if (BSE.utils.isFunction(options.filter)) {
      console.log('开始了', options.filter(v), v)
      return options.filter(v) && BSE.domUtils.getTagName(v) != 'body'
    } else {
      return v === rangeItem.blockNode && BSE.domUtils.getTagName(v) != 'body'
    }
  })
  if (idx != -1) {
    idx += options.includeSelf ? 1 : 0
    let parentNode = rangeItem.parentNodesList
      .slice(0, idx)
      .reverse()
      .reduce((pre, cur) => {
        if (cur?.nodeType == 1) {
          cur.dataset.cacheId ??= BSE.utils.uuidPlus()
          let nodeClone = cur.cloneNode(false)
          innerPNode = nodeClone
          if (!pre) pre = nodeClone
          else pre.append(nodeClone)
        }
        return pre
      }, null)
    console.log('item.range.idx', idx, rangeItem.parentNodesList, parentNode, domUtils.getTagName(innerPNode))
    if (rangeItem.cNode.nodeType == 1) {
      if (['img'].includes(domUtils.getTagName(innerPNode))) {
        result = rangeItem.cNode
      } else if (['tr'].includes(domUtils.getTagName(innerPNode))) {
        innerPNode.parentNode.replaceChild(rangeItem.range.cloneContents(), innerPNode)
        result = parentNode
      } else {
        if (innerPNode) {
          innerPNode.append(rangeItem.range.cloneContents())
          result = parentNode
        } else {
          result = rangeItem.range.cloneContents()
        }
      }
    } else {
      if (innerPNode) {
        innerPNode.append(rangeItem.range.cloneContents())
        result = parentNode
      } else {
        result = rangeItem.range.cloneContents()
      }
    }
  }

  console.log('结果', result)

  // console.log('item.ran2222ge.idx', result, rangeItem.blockNode)
  return result
}

/**
 * 获取每一页下超过底部的dom节点集合
 * @param args
 * @returns {*[]}
 */
const getPageOverBottomDOMList = (...args) => {
  const [paragraphNode, pageWrapNode] = args
  if (paragraphNode?.nodeType != 1) return []
  const bottomDOMList = []
  const pageRect = pageWrapNode.getBoundingClientRect()
  // const tableTagList = Object.keys(BSE.dtd.$tableContent)
  let treeWalker = document.createTreeWalker(paragraphNode, NodeFilter.SHOW_ALL, {
    acceptNode: node => {
      if (node.nodeType == 1) {
        if (['td'].includes(domUtils.getTagName(node))) return NodeFilter.FILTER_REJECT
        //  'tr',
        if (['img', 'tr'].includes(domUtils.getTagName(node))) return NodeFilter.FILTER_ACCEPT
        return NodeFilter.FILTER_SKIP
      } else if (node.nodeType == 3) {
        if (!node.nodeValue.trim()?.length) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_REJECT
    }
  })
  let r = document.createRange()
  // 遍历注释节点和换行文本节点
  while (treeWalker.nextNode()) {
    let cNode = treeWalker.currentNode
    console.log('getPageOverBottomDOMList@2', cNode)
    if (cNode.nodeType == 1) {
      // if (['table', 'tbody', 'thead', 'tr'].includes(domUtils.getTagName(cNode))) continue
      // 元素节点
      cNode.dataset.cacheId ||= BSE.utils.uuidPlus()
      r.setStartBefore(cNode)
      r.setEndAfter(cNode)
      let cRect = getLastClientRect(r)

      switch (BSE.domUtils.getTagName(cNode)) {
        case 'img': {
          // 是图片
          if (cRect && cRect.bottom + 4 >= pageRect.bottom) {
            bottomDOMList.push(cNode)
          }
          break
        }
        case 'tr': {
          console.log('getPageOverBottomDOMList@2', cNode, cRect, pageRect.bottom)
          if (cRect && cRect.top + cNode.offsetHeight >= pageRect.bottom) {
            bottomDOMList.push(cNode)
          }
          break
        }

        default: {
          if (cRect && cRect.bottom >= pageRect.bottom) {
            bottomDOMList.push(cNode)
          }
          break
        }
      }
    } else if (cNode.nodeType == 3) {
      // 文本节点
      r.setStartBefore(cNode)
      r.setEndAfter(cNode)
      let cRect = getLastClientRect(r)
      if (cRect && cRect.bottom >= pageRect.bottom) {
        bottomDOMList.push(cNode)
      }
    }
  }
  return bottomDOMList
}

/**
 * 获取每一页下超过底部的dom range节点集合
 * @param args
 */
const getPageOverBottomDOMRangeList = (...args) => {
  let [paragraphNode, pageWrapNode, bottomDOMList] = args
  const bottomRangeList = []
  bottomDOMList ||= getPageOverBottomDOMList(paragraphNode, pageWrapNode)
  console.log('getPageOverBottomDOMRangeList@1', bottomDOMList)
  const pageRect = pageWrapNode.getBoundingClientRect()
  for (let i = 0; i < bottomDOMList.length; i++) {
    let cNode = bottomDOMList[i]
    let r = document.createRange()
    if (cNode.nodeType == 1) {
      let lastItem = getLastClientRect(cNode)
      let offsetBottom = 0
      // 元素节点
      if (['tr', 'img'].includes(domUtils.getTagName(cNode))) {
        // 是图片
        offsetBottom = 4
        console.log('isBottom')
      } else if (domUtils.getTagName(cNode) == 'tr') {
        // 表格
      }
      if (lastItem && lastItem?.bottom + offsetBottom >= pageRect.bottom) {
        r.setStartBefore(cNode)
        r.setEndAfter(cNode)
        let parentNodesList = domUtils.findParents(cNode, true).reverse()
        let blockNode = getEasyParentBlockNode(cNode, parentNodesList)
        cNode.parentNode.dataset.cacheId ||= BSE.utils.uuidPlus()
        cNode.dataset.cacheId ||= BSE.utils.uuidPlus()
        blockNode.dataset.cacheId ||= BSE.utils.uuidPlus()
        bottomRangeList.push({
          cNode: cNode,
          parentNodesList,
          parentNode: cNode.parentNode,
          range: r,
          blockNode,
          tagName: BSE.domUtils.getTagName(cNode),
          lastClientRect: lastItem
        })
      }
    } else if (cNode.nodeType == 3) {
      console.log('文本节点', cNode)
      // 文本节点
      let textLen = 0
      while (textLen < cNode.textContent.length) {
        r.setStart(cNode, textLen)
        r.setEnd(cNode, textLen + 1)
        const lastItem = getLastClientRect(r)
        if (lastItem && lastItem?.bottom >= pageRect.bottom) {
          r.setStart(cNode, textLen)
          r.setEnd(cNode, cNode.textContent.length)
          console.log('文本节点', lastItem, pageRect.bottom, r.cloneContents())
          let parentNodesList = domUtils.findParents(cNode, true).reverse()
          let blockNode = getEasyParentBlockNode(cNode)
          cNode.parentNode.dataset.cacheId ||= BSE.utils.uuidPlus()
          blockNode.dataset.cacheId ||= BSE.utils.uuidPlus()
          bottomRangeList.push({
            cNode: cNode,
            parentNodesList,
            parentNode: cNode.parentNode,
            range: r,
            blockNode,
            tagName: null,
            lastClientRect: lastItem
          })
          break
        }
        textLen++
      }
    }
  }
  return bottomRangeList
}

/**
 * 删除空内容的节点
 * @param targetNode
 * @param recursion
 */
const removeEmptyNode = (targetNode, recursion = true) => {
  if (BSE.domUtils.getTagName(targetNode) == 'table') {
    if (!targetNode.rows.length) return targetNode.remove()
  }
  const _innerRemoveEmptyNode = node => {
    // 删除空的元素
    if (node.nodeType == 1) {
      console.log('removeEmptyNode@1', node)
      if (['img', 'td', 'tr'].includes(domUtils.getTagName(node))) return
      if (!node.childNodes?.length) return node.remove()
      if (
        node.childNodes.length == 1 &&
        node.childNodes[0].nodeType == 3 &&
        (!node.childNodes[0].textContent?.trim() || domUtils.isZeroWidthNode(node.childNodes[0]))
      ) {
        return node.remove()
      }
    } else if (node.nodeType == 3) {
      if (!node.textContent.trim() || domUtils.isZeroWidthNode(node)) {
        node.remove()
        // console.log('removeEmptyNode@2', node)
      }
    }
  }
  if (targetNode.nodeType == 1) {
    if (recursion) {
      let treeWalker = document.createTreeWalker(targetNode, NodeFilter.SHOW_ALL, {
        acceptNode: node => {
          if (
            node.compareDocumentPosition(targetNode) & Node.DOCUMENT_POSITION_CONTAINS &&
            !['td'].includes(domUtils.getTagName(node))
          ) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      })
      let nodeList = [targetNode]
      while (treeWalker.nextNode()) {
        let cNode = treeWalker.currentNode
        // console.log('nodeList@1', cNode)
        nodeList.splice(0, 0, cNode)
      }
      console.log('nodeList@3', nodeList, targetNode)
      for (let i = 0; i < nodeList.length; i++) {
        let item = nodeList[i]
        _innerRemoveEmptyNode(item)
      }
    } else {
      _innerRemoveEmptyNode(targetNode)
    }
  } else if (targetNode.nodeType == 3) {
    _innerRemoveEmptyNode(targetNode)
  }
}

/**
 * 添加range
 * @param range
 * @param isForce 是否强制清除所有range
 */
const addRange = (range, isForce = true) => {
  const selection = utils.getSelection()
  isForce && selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * 获取祖父节点 是block节点且非body和页节点
 */
const getEasyParentBlockNode = (node, parentNodeList, breakFn) => {
  let result
  parentNodeList ||= BSE.domUtils.findParents(node, true).reverse()
  for (let i = 0; i < parentNodeList.length; i++) {
    let item = parentNodeList[i]
    if (item.nodeType != 1) continue
    if (breakFn && BSE.utils.isFunction(breakFn)) {
      if (breakFn(node)) break
    } else {
      if (item.dataset.page) {
        break
      }
    }
    if (BSE.domUtils.isBlockElm(item)) {
      result = item
      break
    }
  }
  return result
}

/**
 * 获取最后的clientRect值
 * @param node
 * @returns {null|DOMRect}
 */
const getLastClientRect = node => {
  if (node?.getClientRects) {
    const clientRects = node.getClientRects()
    return clientRects.item(clientRects.length - 1)
  }
  return null
}

let oninput = (event, nextContainer, container, containerIdx) => {
  console.log(event)
  const target = event.target
  console.time('计时')

  switch (event.inputType) {
    // case 'insertParagraph': {
    //   break
    // }
    case 'deleteContentBackward': {
      // 删除内容
      let curRange = utils.getRangeAt()

      let rangeCommonParentNodesList = BSE.domUtils.findParents(curRange.commonAncestorContainer, true).reverse()
      let rangeCommonParentNodeIdx = rangeCommonParentNodesList.findIndex(v => v === target)

      console.log('rangeCommonParentNodeIdx', rangeCommonParentNodeIdx, containerIdx)

      console.log(curRange.commonAncestorContainer)
      let rect = target.getBoundingClientRect()
      let rectRight = rect.right
      let range = document.createRange()
      if (target.nodeType == 3) {
        // 文本
        range.setStart(target, 0)
        range.setEndAfter(target)
      } else if (target.nodeType == 1) {
        // 元素
        console.log(target.childNodes.length - 1)
        range.setStartBefore(target)
        range.setEndAfter(target.lastChild)
      }
      const lastItem = getLastClientRect(range)
      let lastItemRight = lastItem.right
      let spacing = rectRight - lastItemRight // 间距

      if (spacing < 0) return
      if (!nextContainer) return

      let treeWalker = document.createTreeWalker(nextContainer, NodeFilter.SHOW_TEXT, {
        // acceptNode: node => {
        //   return node.nodeType == 3 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        // }
        acceptNode: node => NodeFilter.FILTER_ACCEPT
      })

      const fragment = document.createDocumentFragment()
      // 遍历注释节点和换行文本节点
      while (treeWalker.nextNode() && spacing >= 0) {
        let node = treeWalker.currentNode

        if (node.nodeType == Node.TEXT_NODE && node.nodeValue.trim() != '') {
          const r = document.createRange()
          let textLen = 0
          // let parentArr = domUtils.
          // let parentEle = domUtils.findParents(node, true).reverse()
          // const parentBlockEleIdx = parentEle.findIndex(v => domUtils.isBlockElm(node))
          // parentEle = parentBlockEleIdx - 1 > 0 ? parentEle.slice(0, parentBlockEleIdx - 1) : parentEle
          // let parentNodes = parentEle.map(v => v.cloneNode(false))
          while (textLen < node.textContent.length) {
            r.setStart(node, textLen)
            r.setEnd(node, textLen + 1)
            let lastRRectItem = getLastClientRect(r)
            if (spacing > 0 && lastRRectItem?.width) {
              console.log('node', spacing, lastRRectItem.width)
              spacing -= lastRRectItem.width
              if (spacing < 0) break
              // const parentNode = parentNodes.at(-1)
              // let tmpTextNode = document.createTextNode(r.deleteContents())
              // tmpTextNode.appendData()
              // console.log('extractContents', r.extractContents())
              // let text = document.createTextNode(r.toString())
              let content = r.extractContents()
              fragment.appendChild(content)
            } else {
              textLen++
            }
          }
          const p = document.querySelector('p')
          // p.childNodes.forEach(v => {
          //   if (v.nodeType == 3) {
          //     v.textContent = v.textContent.trim()
          //   }
          // })
          p.append(fragment)
          // const range1 = document.createRange()
          // range.setEndAfter(p.lastChild)
          // range1.insertNode(fragment)
        } else if (node.nodeType == Node.ELEMENT_NODE) {
        }
        // const nodeRect = node.getClientRects()
        // let lastNodeRectItem = nodeRect.item(nodeRect.length - 1)
        // if (spacing < lastNodeRectItem.width) {
        //   const r = document.createRange()
        // } else {
        // }
        console.log(node)
      }
      break
    }
    case 'insertParagraph':
    case 'insertText':
    case 'insertCompositionText': {
      // 插入文本
      let range = document.createRange(),
        originRange = utils.getRangeAt(),
        selection = window.getSelection(),
        pageRect = target.getBoundingClientRect(),
        originRangeClone = originRange.cloneRange()

      let _isBottom = false // 是否已经处于底部了
      let _isCursorEnd = false // 光标是否处于末尾
      let _isBottomRangeList = [] // 处于底部的rangeList
      let _isCursorStart = false // 光标是否处于开头
      let _blockNodeList = [] // 有哪些block节点需要转换到下一行

      let _cursorBlockNodeInfo = {
        isFocusInTd: false, // 光标是否在td中
        target: null, // 光标父级block
        table: {
          target: null,
          tr: null,
          td: null
        }
      } // 光标所处block节点信息

      // 获取有哪些block节点超出了页底部
      for (let i = 0; i < target.childNodes.length; i++) {
        const item = target.childNodes[i]
        const itemRect = getLastClientRect(item)
        if (itemRect && itemRect.bottom > pageRect.bottom) {
          _blockNodeList.push(item)
        }
      }

      console.log('_blockNodeList@1', _blockNodeList)

      /// 获取所有超出页底部的节点，并通过range包裹
      for (let i = 0; i < _blockNodeList.length; i++) {
        let item = _blockNodeList[i]
        if (item.nodeType == 1) {
          // 元素节点
          console.log('元素节点', item)
          _isBottomRangeList.push(getPageOverBottomDOMRangeList(item, target))
        } else if (item.nodeType == 3) {
          // 文本节点
          // const textContent = v.textContent
        }
      }

      _isBottomRangeList = _isBottomRangeList.flat(Infinity)

      // let lastTargetChildNode = getLastBlockChildNode(target)

      console.log('_isBottomRangeList@1', _isBottomRangeList)

      _isBottom = !!_isBottomRangeList.length

      if (_isBottom) {
        // 是否可以要进行截取切割换行
        _isCursorEnd = isCursorEnd(originRange, target)
        _isCursorStart = isCursorStart(originRange)
        _isBottomRangeList = _isBottomRangeList.reverse()

        console.log('_isCursorEnd', _isBottom, _isCursorEnd, _isBottomRangeList)

        // 获取光标父级block 和 光标是否在table中书写
        let startParentsList = BSE.domUtils.findParents(originRange.startContainer, true).reverse()
        for (let i = 0; i < startParentsList.length - 1; i++) {
          let item = startParentsList[i]
          if (item.dataset?.page) break
          if (BSE.domUtils.isBlockElm(item)) {
            _cursorBlockNodeInfo.target = item
          }
          if (BSE.domUtils.getTagName(item) == 'td') {
            _cursorBlockNodeInfo.isFocusInTd = true
            _cursorBlockNodeInfo.table.td = item
            _cursorBlockNodeInfo.table.tr = item.parentElement
          }
          if (BSE.domUtils.getTagName(item) == 'table') {
            _cursorBlockNodeInfo.table.target = item
          }
        }

        console.log('startParentsList@1', _cursorBlockNodeInfo)

        for (let i = 0; i < _isBottomRangeList.length; i++) {
          let item = _isBottomRangeList[i]

          if (_cursorBlockNodeInfo.isFocusInTd && item.cNode === _cursorBlockNodeInfo.table.tr) {
            _cursorBlockNodeInfo.table.tr.__willMoveToNext = true // 是否当前row要移到下一行
          }

          const commonCutNode = item => {
            if (domUtils.getTagName(item.cNode) == 'tr') {
              let nextCFirstChild = getFirstBlockChildNode(nextContainer) // 下一个容器的第一个子节点
              if (domUtils.getTagName(nextCFirstChild) == 'table') {
                const nextTrNode = nextCFirstChild.querySelector(`[data-cache-id="${item.cNode.dataset.cacheId}"]`)
                if (nextTrNode) {
                  let r = document.createRange()
                  for (let j = 0, len = item.cNode.cells.length; j < len; j++) {
                    let tdNode = item.cNode.cells[j]
                    let nextTdNode = nextTrNode.cells[j]
                    if (tdNode && nextTdNode) {
                      r.selectNodeContents(tdNode)
                      nextTdNode.prepend(r.extractContents())
                    }
                  }
                  item.cNode.remove()
                }
              }
            } else {
              if (item.parentNode) {
                item.parentNode.dataset.cacheId ||= BSE.utils.uuidPlus()
                let parentNodeClone = item.parentNode.cloneNode(false), // 父节点浅复制
                  blockNodeClone = item.blockNode.cloneNode(false) // 块级节点浅复制

                let nextCFirstChild = getFirstBlockChildNode(nextContainer) // 下一个容器的第一个子节点

                if (nextCFirstChild) {
                  // 第一个元素存在

                  if (nextCFirstChild?.nodeType == 1) {
                    // 第一个元素是元素节点

                    if (item.cNode.nodeType == 1) {
                      //要插入的节点是元素

                      if (nextCFirstChild.dataset.cacheId == blockNodeClone.dataset.cacheId) {
                        // 如果根节点存在
                        if (blockNodeClone.dataset.cacheId == parentNodeClone.dataset.cacheId) {
                          // 如果根节点和父节点一致，就直接添加到根节点中
                          if (BSE.domUtils.getTagName(item.cNode) == 'img') {
                            // TODO
                            nextCFirstChild.prepend(item.cNode)
                          } else {
                            nextCFirstChild.prepend(item.cNode)
                          }
                        } else {
                          if (BSE.domUtils.getTagName(item.cNode) == 'img') {
                            nextCFirstChild.prepend(item.cNode)
                          } else {
                            // TODO 要删除
                            if (BSE.domUtils.getTagName(item.cNode) == 'td') {
                              // 如果不一致，先添加到父节点中，然后将父节点添加到根节点中
                              const cTargetNode = nextCFirstChild.querySelector(
                                `[data-cache-id="${item.cNode.dataset.cacheId}"]`
                              )
                              if (cTargetNode) {
                                cTargetNode.prepend(item.range.extractContents())
                              } else {
                                // 没有找到相同的节点
                                const fullFragment = createElementFullFragment(item)
                                if (fullFragment) {
                                  item.range.deleteContents()
                                  nextCFirstChild.prepend(fullFragment)
                                } else {
                                  parentNodeClone.append(item.range.extractContents())
                                  nextCFirstChild.prepend(parentNodeClone)
                                }
                              }
                            } else {
                              // 如果不一致，先添加到父节点中，然后将父节点添加到根节点中
                              const targetNode = nextCFirstChild.querySelector(
                                `[data-cache-id="${parentNodeClone.dataset.cacheId}"]`
                              )
                              console.log('nextCFirstChild@2', targetNode)
                              if (targetNode) {
                                // 找到相同的节点
                                targetNode.prepend(item.range.extractContents())
                              } else {
                                // 没有找到相同的节点
                                const fullFragment = createElementFullFragment(item)
                                if (fullFragment) {
                                  item.range.deleteContents()
                                  nextCFirstChild.prepend(fullFragment)
                                } else {
                                  parentNodeClone.append(item.range.extractContents())
                                  nextCFirstChild.prepend(parentNodeClone)
                                }
                              }
                            }
                          }
                        }
                      } else {
                        console.log('如果根节点存在1', nextCFirstChild, item.blockNode, item.parentNode)

                        // 根节点不存在
                        const fullFragment = createElementFullFragment(item)
                        if (fullFragment) {
                          item.range.deleteContents()
                          blockNodeClone.append(fullFragment)
                        } else {
                          parentNodeClone.append(item.range.extractContents())
                        }
                        // nextContainer.insertAdjacentElement('afterbegin', blockNodeClone)
                        nextContainer.prepend(blockNodeClone)
                      }
                    } else if (item.cNode.nodeType == 3) {
                      // 要插入的节点是文本

                      console.log('nextCFirstChildTextNode@1', item.cNode)
                      // continue
                      if (nextCFirstChild.dataset.cacheId == blockNodeClone.dataset.cacheId) {
                        // 如果根节点存在
                        if (blockNodeClone.dataset.cacheId == parentNodeClone.dataset.cacheId) {
                          // 如果根节点和父节点一致，就直接添加到根节点中
                          nextCFirstChild.prepend(item.range.extractContents())
                        } else {
                          // 如果不一致，先添加到父节点中，然后将父节点添加到根节点中
                          const targetNode = nextCFirstChild.querySelector(
                            `[data-cache-id="${parentNodeClone.dataset.cacheId}"]`
                          )
                          if (targetNode) {
                            // 找到相同的节点
                            targetNode.prepend(item.range.extractContents())
                          } else {
                            // 没有找到相同的节点
                            const fullFragment = createElementFullFragment(item)
                            if (fullFragment) {
                              item.range.deleteContents()
                              nextCFirstChild.prepend(fullFragment)
                            } else {
                              parentNodeClone.append(item.range.extractContents())
                              nextCFirstChild.prepend(parentNodeClone)
                            }
                          }
                        }
                      } else {
                        // 根节点不存在
                        const fullFragment = createElementFullFragment(item)
                        if (fullFragment) {
                          item.range.deleteContents()
                          blockNodeClone.append(fullFragment)
                        } else {
                          blockNodeClone.prepend(item.range.extractContents())
                        }
                        nextContainer.prepend(blockNodeClone)
                        // nextContainer.insertAdjacentElement('afterbegin', blockNodeClone)
                      }
                    }
                  } else if (nextCFirstChild?.nodeType == 3) {
                    // 第一个元素是文本节点
                    // console.log('插入了@3', parentNodeClone)
                    const fullFragment = createElementFullFragment(item)
                    if (fullFragment) {
                      item.range.deleteContents()
                      blockNodeClone.append(fullFragment)
                      blockNodeClone.append(nextCFirstChild)
                    } else {
                      blockNodeClone.prepend(item.range.extractContents())
                    }
                    nextContainer.prepend(blockNodeClone)
                  }
                } else {
                  // 第一个元素不存在
                  const fullFragment = createElementFullFragment(item)
                  if (fullFragment) {
                    console.log('item.range', item.range, blockNodeClone, fullFragment)
                    item.range.deleteContents()
                    blockNodeClone.append(fullFragment)
                  } else {
                    blockNodeClone.prepend(item.range.extractContents())
                  }
                  nextContainer.prepend(blockNodeClone)
                  // nextContainer.insertAdjacentElement('afterbegin', blockNodeClone)
                }

                // 删除空的元素
                console.log('删除空的元素', item.parentNode)
                // removeEmptyNode(item.parentNode)
                removeEmptyNode(item.blockNode)

                console.log(
                  'startParentsList@2',
                  _cursorBlockNodeInfo,
                  _cursorBlockNodeInfo.isFocusInTd,
                  _cursorBlockNodeInfo.table.tr?.__willMoveToNext
                )

                if (_isCursorEnd) {
                  // 要准备换行了 ⚠️
                  if (_cursorBlockNodeInfo.isFocusInTd) {
                    const { table } = _cursorBlockNodeInfo
                    // 如果处于table的td cell中
                    if (table.tr.__willMoveToNext) {
                      // addRange(originRange)
                      // console.log('startParentsList@3', originRange, originRangeClone)
                      // nextContainer.focus()
                    }
                  } else {
                    console.log('光标定位了@1', parentNodeClone, parentNodeClone.lastChild)
                    if (parentNodeClone?.lastChild) {
                      // 如果存在要截取的节点的父节点存在最后的节点
                      range.setEndAfter(parentNodeClone.lastChild)
                    } else {
                      if (blockNodeClone?.lastChild) {
                        // 如果上级块级节点存在最后的节点
                        range.setEndAfter(blockNodeClone.lastChild)
                      } else {
                        if (nextContainer?.firstChild) {
                          // 设置在下一个子节点内部第一个
                          range.setEnd(nextContainer?.firstChild, 0)
                        } else {
                          // 设置下一页的第一个子节点前面
                          range.setEnd(nextContainer, 0)
                        }
                      }
                    }
                    addRange(range)
                    range.collapse(false)
                    // if (event.isComposing) return
                    nextContainer.focus()
                  }
                } else {
                  console.log('光标定位了@2')
                  range.setEnd(originRange.endContainer, originRange.endOffset)
                }
              }
            }
          }

          console.log('_isBottomRangeList@4', _isBottomRangeList)

          if (domUtils.getTagName(item.cNode) == 'tr') {
            // TODO
            let trDefaultHeight = 22
            console.log('getTagNametr@1', item.cNode.cells, item.cNode, item.cNode.offsetHeight)
            item.parentNode.dataset.cacheId ||= BSE.utils.uuidPlus()
            let parentNodeClone = item.parentNode.cloneNode(false), // 父节点浅复制
              blockNodeClone = item.blockNode.cloneNode(false) // 块级节点浅复制
            let r = document.createRange()
            let tdBottomNodeList = []
            let tdBottomRangeNodeList = []

            for (let j = 0, len = item.cNode.cells.length; j < len; j++) {
              let cellNode = item.cNode.cells[j]
              cellNode.dataset.cacheId ??= BSE.utils.uuidPlus()
              let treeWalker = document.createTreeWalker(cellNode, NodeFilter.SHOW_ALL, {
                acceptNode(node) {
                  if (node.nodeType == 1) {
                    return node.dataset.cacheId ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
                  } else if (node.nodeType == 3) {
                    return NodeFilter.FILTER_ACCEPT
                  }
                  return NodeFilter.FILTER_REJECT
                }
              })
              while (treeWalker.nextNode()) {
                let cNode = treeWalker.currentNode
                if (cNode.nodeType == 1) {
                  cNode.dataset.cacheId ??= BSE.utils.uuidPlus()
                } else if (cNode.nodeType == 3) {
                  // 文本节点
                  if (item.cNode.offsetHeight > trDefaultHeight) {
                    r.setStartBefore(cNode)
                    r.setEndAfter(cNode)
                    let cRect = getLastClientRect(r)
                    if (cRect && cRect.bottom >= pageRect.bottom) {
                      tdBottomNodeList.push(cNode)
                    }
                  }
                }
              }
            }
            if (item.cNode.offsetHeight > trDefaultHeight) {
              // pageRect.bottom - item.lastClientRect.top > trDefaultHeight
              tdBottomRangeNodeList.push(...getPageOverBottomDOMRangeList(item, target, tdBottomNodeList))
              tdBottomNodeList = tdBottomNodeList.reverse()

              console.log('getTagNametr@3', tdBottomRangeNodeList, tdBottomNodeList)
              if (tdBottomRangeNodeList.length) {
                for (let j = 0; j < tdBottomRangeNodeList.length; j++) {
                  let tdRangeItem = tdBottomRangeNodeList[j]
                  console.log('getTagNametr@2', '超过了', tdRangeItem)
                  if (tdRangeItem.parentNode) {
                    tdRangeItem.parentNode.dataset.cacheId ||= BSE.utils.uuidPlus()
                    let nextCFirstChild = getFirstBlockChildNode(nextContainer) // 下一个容器的第一个子节点
                    if (nextCFirstChild) {
                      // 第一个元素存在
                      if (nextCFirstChild?.nodeType == 1) {
                        // 第一个元素是元素节点
                        if (tdRangeItem.cNode.nodeType == 1) {
                        } else if (tdRangeItem.cNode.nodeType == 3) {
                          console.log('TRtext@1', tdRangeItem.cNode)
                          // 要插入的节点是文本
                          // debugger
                          console.log('nextCFirstChildTextNode@1', tdRangeItem.cNode)
                          // continue
                          if (nextCFirstChild.dataset.cacheId == blockNodeClone.dataset.cacheId) {
                            // 如果根节点存在
                            // 查看文本节点的父节点是否存在
                            // debugger
                            const targetNode = nextCFirstChild.querySelector(
                              `[data-cache-id="${tdRangeItem.parentNode.dataset.cacheId}"]`
                            )
                            if (targetNode) {
                              // 父的节点存在
                              targetNode.prepend(tdRangeItem.range.extractContents())
                            } else {
                              // 父级节点不存在
                              let nextTrNode = nextCFirstChild.querySelector(
                                `[data-cache-id="${item.cNode.dataset.cacheId}"]`
                              )
                              if (nextTrNode) {
                                // 找其父级tr节点
                                // 存在
                                let parentTargetNode = nextTrNode.querySelector(
                                  `[data-cache-id="${tdRangeItem.cNode.parentNode.dataset.cacheId}"]`
                                )
                                console.log('tdRangeItem.cNode.parentNode', tdRangeItem.cNode.parentNode)
                                if (parentTargetNode) {
                                  const text = document.createTextNode(tdRangeItem.range.extractContents().textContent)
                                  range.setEnd(text, text.textContent.length)
                                  parentTargetNode.prepend(text)
                                } else {
                                  const contentFragment = createElementFullFragment(tdRangeItem, {
                                    filter: node => BSE.domUtils.getTagName(node) == 'td',
                                    includeSelf: true
                                  })

                                  console.log('contentFragment.parentNode', contentFragment, contentFragment)

                                  let tdTargetNode = nextTrNode.querySelector(
                                    `[data-cache-id="${contentFragment.dataset.cacheId}"]`
                                  )

                                  if (tdTargetNode) {
                                    const text = document.createTextNode(
                                      tdRangeItem.range.extractContents().textContent
                                    )
                                    range.setEnd(text, text.textContent.length)
                                    tdTargetNode.prepend(text)
                                  } else {
                                    const tmpCellIndex = contentFragment.cellIndex
                                    let tdNodeClone = contentFragment.clone(false)
                                    // const tmpFrag = document.createRange().createContextualFragment('<p></p>')
                                    if (tmpCellIndex.cells[tmpCellIndex + 1]) {
                                      nextTrNode.insertBefore(tdNodeClone, tmpCellIndex.cells[tmpCellIndex + 1])
                                    }
                                  }

                                  // TODO 后面考虑删除还是添加
                                  // const tmpCellIndex = tdRangeItem.cNode.parentNode.cellIndex
                                  // if (tmpCellIndex < 0) {
                                  //   tdTargetNode.cells[tmpCellIndex - 1].
                                  //   tdTargetNode.insertBefore()
                                  // }
                                  // tdTargetNode.cells[tmpCellIndex - 1]
                                }
                              } else {
                                // 不存在
                                let tbodyNode = nextCFirstChild.querySelector(
                                  `[data-cache-id="${item.parentNode.dataset.cacheId}"]`
                                )
                                if (tbodyNode) {
                                  let trCloneNode = item.cNode.cloneNode(false)
                                  for (let k = 0, len = item.cNode.cells.length; k < len; k++) {
                                    let tmpNode = item.cNode.cells[k].cloneNode(false)
                                    // tmpNode.textContent = `#`
                                    trCloneNode.append(tmpNode)
                                  }
                                  const contentFragment = createElementFullFragment(tdRangeItem, {
                                    filter: node => BSE.domUtils.getTagName(node) == 'td',
                                    includeSelf: true
                                  })
                                  let tdTargetNode = trCloneNode.querySelector(
                                    `[data-cache-id="${contentFragment.dataset.cacheId}"]`
                                  )
                                  console.log('tdRangeItem.cNode', tdRangeItem.cNode)
                                  let tmpCNodeParentNodeClone = tdRangeItem.parentNode.cloneNode(false)
                                  const text = document.createTextNode(tdRangeItem.range.extractContents().textContent)
                                  range.setEnd(text, text.textContent.length)
                                  tmpCNodeParentNodeClone.append(text)
                                  tdTargetNode.prepend(tmpCNodeParentNodeClone)
                                  tbodyNode.prepend(trCloneNode)
                                } else {
                                  // TODO 后面考虑删除还是添加
                                  alert(1)
                                }
                              }
                            }
                          } else {
                            // 根节点不存在
                            const fullFragment = createElementFullFragment(item)
                            if (fullFragment) {
                              tdRangeItem.range.deleteContents()
                              blockNodeClone.append(fullFragment)
                            } else {
                              blockNodeClone.prepend(tdRangeItem.range.extractContents())
                            }
                            nextContainer.prepend(blockNodeClone)
                            // nextContainer.insertAdjacentElement('afterbegin', blockNodeClone)
                          }
                        }
                      } else if (nextCFirstChild?.nodeType == 3) {
                        // 第一个元素是文本节点
                        // console.log('插入了@3', parentNodeClone)
                        const fullFragment = createElementFullFragment(item)
                        if (fullFragment) {
                          tdRangeItem.range.deleteContents()
                          blockNodeClone.append(fullFragment)
                          blockNodeClone.append(nextCFirstChild)
                        } else {
                          blockNodeClone.prepend(tdRangeItem.range.extractContents())
                        }
                        nextContainer.prepend(blockNodeClone)
                      }
                    } else {
                      // 第一个元素不存在
                      const fullFragment = createElementFullFragment(item)
                      if (fullFragment) {
                        console.log('tdRangeItem.range', tdRangeItem.range, blockNodeClone, fullFragment)
                        tdRangeItem.range.deleteContents()
                        blockNodeClone.append(fullFragment)
                      } else {
                        blockNodeClone.prepend(tdRangeItem.range.extractContents())
                      }
                      nextContainer.prepend(blockNodeClone)
                      // nextContainer.insertAdjacentElement('afterbegin', blockNodeClone)
                    }
                    // 删除空的元素
                    removeEmptyNode(tdRangeItem.blockNode)

                    if (_isCursorEnd) {
                      // 要准备换行了 ⚠️
                      if (_cursorBlockNodeInfo.isFocusInTd) {
                        const { table } = _cursorBlockNodeInfo
                        // 如果处于table的td cell中
                        if (table.tr.__willMoveToNext) {
                          if (nextCFirstChild) {
                            if (nextCFirstChild.nodeType == 1) {
                              if (domUtils.getTagName(nextCFirstChild) == 'table') {
                                let nextTrNode = nextCFirstChild.querySelector(
                                  `[data-cache-id="${table.tr.dataset.cacheId}"]`
                                )
                                if (nextTrNode) {
                                  let treeWalker = document.createTreeWalker(
                                    nextTrNode.cells[table.td.cellIndex],
                                    NodeFilter.SHOW_TEXT
                                  )
                                  let tmpNode
                                  while (treeWalker.nextNode()) {
                                    let node = treeWalker.currentNode
                                    if (node.textContent.trim() && !domUtils.isZeroWidthNode(node)) {
                                      tmpNode = node
                                      break
                                    }
                                  }
                                  if (tmpNode) {
                                    range.setEnd(tmpNode, 1)
                                  } else {
                                    range.setEnd(nextTrNode.cells[table.td.cellIndex], 0)
                                  }
                                } else {
                                  range.setEnd(originRange.rows[table.tr.rowIndex].cells[table.td.cellIndex], 0)
                                }
                                range.collapse(false)
                                addRange(range)
                                nextContainer.focus()
                              }
                            }
                          }
                        }
                      } else {
                        console.log('光标定位了@1', parentNodeClone, parentNodeClone.lastChild)
                        if (parentNodeClone?.lastChild) {
                          // 如果存在要截取的节点的父节点存在最后的节点
                          range.setEndAfter(parentNodeClone.lastChild)
                        } else {
                          if (blockNodeClone?.lastChild) {
                            // 如果上级块级节点存在最后的节点
                            range.setEndAfter(blockNodeClone.lastChild)
                          } else {
                            if (nextContainer?.firstChild) {
                              // 设置在下一个子节点内部第一个
                              range.setEnd(nextContainer?.firstChild, 0)
                            } else {
                              // 设置下一页的第一个子节点前面
                              range.setEnd(nextContainer, 0)
                            }
                          }
                        }
                        addRange(range)
                        range.collapse(false)
                        // if (event.isComposing) return
                        nextContainer.focus()
                      }
                    } else {
                      console.log('光标定位了@2')
                      range.setEnd(originRange.endContainer, originRange.endOffset)
                    }
                  }
                }
              }
            } else {
              commonCutNode(item)
            }
          } else {
            commonCutNode(item)
          }
          console.log('isCursorEnd', _isCursorEnd)
          removeEmptyNode(item.blockNode)
        }
      }

      // 回车事件
      if (event.inputType == 'insertParagraph') {
        let blockNode = getEasyParentBlockNode(originRange.endContainer)
        console.log('insertParagraph@1', originRange, originRange.startContainer.childNodes, blockNode, pageRect.bottom)

        if (originRange.endContainer.nodeType == 1) {
          if (domUtils.getTagName(originRange.endContainer.childNodes[originRange.endOffset]) == 'table') {
            const rootChildNodes = Array.from(target.childNodes)
            for (let i = 0; i < rootChildNodes.length; i++) {
              let item = rootChildNodes[i]
              if (item.nodeType == 1) {
                if (domUtils.isBrEle(item)) {
                  let p = document.createElement('p')
                  item.parentNode.insertBefore(p, item)
                  p.append(item)
                }
              } else if (item.nodeType == 3) {
                let p = document.createElement('p')
                item.parentNode.insertBefore(p, item)
                p.append(item)
              }
            }
          }
        }

        if (nextContainer?.firstChild) {
          let oRangeRect = getLastClientRect(originRange)
          if (oRangeRect) {
            if (oRangeRect.bottom >= pageRect.bottom) {
              // 原来的光标位置超过当前页底部
              // if (nextContainer.firstChild) {
              //   originRange.setEnd(nextContainer.firstChild, 0)
              // } else {
              //
              // }
              originRange.setEnd(nextContainer.firstChild, 0)
              // addRange(range)
              range.collapse(false)
              nextContainer.focus()
            }
          } else {
            const blockNodeRect = getLastClientRect(blockNode)
            if (blockNodeRect && blockNodeRect.bottom >= pageRect.bottom) {
              // 原来的光标位置块级标签 超过当前页底部
              originRange.setEnd(nextContainer.firstChild, 0)
              // addRange(range)
              range.collapse(false)
              nextContainer.focus()
            }
          }
        }
        if (blockNode) {
          let attrList = Object.values(blockNode.attributes)
          for (let i = 0; i < attrList.length; i++) {
            blockNode.removeAttribute(attrList[i].name)
          }
          removeEmptyNode(blockNode)
        }
      }
      break
    }
  }
  document.body.normalize()
  console.timeEnd('计时')
}

const containerDOMS = document.querySelectorAll('body>div[contenteditable="true"]')
containerDOMS.forEach((v, vi) => {
  console.log(v)
  v.oninput = event => {
    let nextContainer = containerDOMS[vi + 1] ?? null
    oninput(event, nextContainer, v, vi)
  }
})

// firstContainer.oninput = oninput
const utils = {
  /**
   * 获取select属性
   * @returns {Selection}
   */
  getSelection() {
    // ie: const selection = document.selection.createRange();
    return window.getSelection()
  },

  /**
   * 获取原生自带的 Range 对象
   * @param idx
   */
  getRangeAt(idx = 0) {
    try {
      return window.getSelection().getRangeAt(0)
    } catch {
      return null
    }
  },

  /**
   * 创建range对象
   * @returns {Range}
   */
  creatRange() {
    // range = document.createRange();
    const range = new this.window.Range()
    return range
  },

  createStartText() {
    const uniq = Math.random().toString(16).slice(2, 8)
    let startText = document.createElement('text')
    startText.setAttribute('id', `_bse_paging_$0_${uniq}`)
    // startText.style.cssText = 'height: 0'
    // startText.innerHTML = `&#8205;`
    return startText
  },

  addRange(range) {
    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
