export default {
    install(Vue, options) {
        Vue.prototype.$url = {
            el: {},
            sliceParams: {},
            pageParam: 'page',
            cache: '',
            _initCache(attrId, attrVal) {
                if (!Array.isArray(attrVal)) attrVal = [attrVal || '']
                this.cache = [attrId, attrVal.sort().join('_')].join('_');
                return this
            },
            _initEvents (_url) {
                if (!Array.isArray(_url.events)
                    || this._getValues(this.el, this.cache)
                    && this.el[this.cache].length === _url.events.length) return this
                this.el[this.cache] = {}
                this.sliceParams = _url.sliceParams
                this._split(_url.events)
                return this
            },
            _split (events) {
                if (typeof events == 'string') {
                    let evArray = events.split(this.sliceParams.joinItem)
                    evArray.length >= 2 && this._addThis(evArray[0], evArray[1])
                } else if (Array.isArray(events)) {
                    events.forEach(evs => this._split(evs))
                }
            },
            _join (data) {
                let ev = []
                for (let key in data) {
                    if (Array.isArray(data[key])) {
                        data[key].forEach((v,k) => {
                            typeof v === 'object' 
                                ? this._join(v) 
                                : ev.push(this.sliceParams.orItem, key, this.sliceParams.joinItem, v)
                        })
                    } else if (typeof data[key] == 'string') {
                        ev.push(this.sliceParams.joinParams, key, this.sliceParams.joinItem, data[key])
                    }
                }
                return ev.join('').substring(1)
            },
            _add (key, val) {
                this._split([key, this.sliceParams.joinItem, val].join(''))
                return this.el[this.cache]
            },
            _addThis (key, vals) {
                if (Array.isArray(vals)) {
                    vals.forEach(val => this._addThis(key, val))
                    return
                }
                if (!vals) return
                if (this.el[this.cache][key]) {
                    Array.isArray(this.el[this.cache][key]) 
                        ? this.el[this.cache][key].indexOf(vals) <= -1 && this.el[this.cache][key].push(vals) 
                        : this.el[this.cache][key] != vals && (this.el[this.cache][key] = [this.el[this.cache][key], vals])
                    return
                }
                this.el[this.cache][key] = vals
                return this.el[this.cache]
            },
            _removeThis (key) {
                delete this.el[this.cache][key]
            },
            _price ({startPrice, endPrice}) {
                let [startPrices, endPrices] = [parseInt(startPrice), parseInt(endPrice)]
                if (isNaN(startPrices) && isNaN(endPrices)) return
                return [this.sliceParams.priceFirstPrefix
                    , this.sliceParams.joinItem
                    , this.sliceParams.priceStartPrefix
                    , isNaN(startPrices) ? 0 : startPrices
                    , this.sliceParams.priceEndPrefix
                    , isNaN(endPrices) ? 0 : endPrices
                    ].join('')
            },
            _brand ({brandIds = []}, key = null) {
                if (!Array.isArray(brandIds)) brandIds = []
                let brands = this._arrayMerae(brandIds, ['string', 'number'].includes(typeof key) && this._getValues(this.el.brands, key) ? this.el.brands[key] : []);
                if (!brands.length) return
                return [this.sliceParams.brandFirstPrefix
                    , this.sliceParams.joinItem
                    , brands.join(this.sliceParams.orItem)
                    ].join('')
            },
            _arrayMerae (array1, array2) {
                if (!Array.isArray(array1)) return []
                if (!Array.isArray(array2)) array2 = []
                array1.forEach(v => {
                    !array2.includes(v) && array2.unshift(v)
                })
                return array2
            },
            _addThisBrand (brandId, key) {
                if (!brandId || key === undefined) return this
                if (!Array.isArray(this.el.brands)) this.el.brands = []
                if (!this.el.brands[key]) this.el.brands[key] = []
                if (Array.isArray(brandId)) {
                    brandId.forEach(v => {
                        if (!this.el.brands[key].includes(v)) this.el.brands[key].push(v)
                    })
                } else if (['number', 'string'].includes(typeof brandId)) {

                    if (!this.el.brands[key].includes(brandId)) this.el.brands[key].push(brandId)
                }
                return this
            },
            _getValues(array, key) {
                if (typeof array === 'object' && array[key]) return array[key]
                return undefined
            },
            category (_url, cids) {
                if (!Array.isArray(cids)) cids = [cids]
                return {
                    path: '/list/' +  cids.filter(x => ['string', 'number'].includes(typeof x)).join(_url.sliceParams.joinCatLevel),
                    // params: {cid: 1},
                    query: {
                        ev: this._getValues(_url.params, 'ev'),
                        sort: this._getValues(_url.params, 'sort'),
                        hl: this._getValues(_url.params, 'hl')
                    }
                }
            },
            attr (_url, attrId, attrName, attrVal) {
                this._initCache(attrId, attrVal);
                if (!this.el[this.cache]) this.el[this.cache] = {}
                if (this._getValues(this.el[this.cache]), attrId) this.el[this.cache][attrId] = []
                this._initEvents(_url)
                    ._addThis(attrId, attrVal)
                attrName === undefined && this._removeThis(attrId)
                let events = [this._join(this.el[this.cache])
                    , this._price(_url)
                    , this._brand(_url)
                    ].filter(x => x)
                return { 
                    query: {
                        ev: events.length ? events.join(this.sliceParams.joinParams) : undefined,
                        sort: this._getValues(_url.params, 'sort'),
                        hl: attrName 
                            ? [attrName
                            , Array.isArray(attrVal) ? attrVal.pop() : attrVal
                            ].join(this.sliceParams.joinItem) 
                            : undefined
                    }
                }
            },
            brand (_url, bid = '', key) {
                if (this._getValues(this.el.brands, key)) this.el.brands[key] = []
                this._addThisBrand(bid, key)
                    ._initCache(key)
                    ._initEvents(_url)
                let events = [this._join(this.el[this.cache])
                    , this._price(_url)
                    , this._brand({}, key)
                    ].filter(x => x)
                return {
                    query: {
                        ev: events.length ? events.join(this.sliceParams.joinParams) : undefined,
                        sort: this._getValues(_url.params, 'sort'),
                        hl: this._getValues(_url.params, 'hl')
                    },
                    //linkActiveClass: ''
                }
            },
            price () {
                
            },
            sort (_url, sort = 'all') {
                let orderSort = {
                    query: {
                        ev: this._getValues(_url.params, 'ev'),
                        hl: this._getValues(_url.params, 'hl'),
                    }
                }, order = !_url.sort.order || _url.sort.type.substring(0, 2) != sort || _url.sort.order === 'desc'
                    ? 'asc'
                    : 'desc', 
                sorts = {
                    sa: 'sales', // 销量
                    pr: 'price', // 价格
                    co: 'comment-count', // 评论数
                    da: 'date' // 上架时间
                }
                for (let x in sorts) {
                    if (x === sort) {
                        orderSort.query.sort = [sorts[x], order].join(_url.sliceParams.sortJoinItem)
                        return orderSort
                    }
                }
                delete orderSort.query.sort // 综合排序
                return orderSort
            },
            pages (_url, pages) {
                return {
                    query: {
                        ev: this._getValues(_url.params, 'ev'),
                        sort: this._getValues(_url.params, 'sort'),
                        hl: this._getValues(_url.params, 'hl'),
                        [this.pageParam]: typeof pages == 'number' ? pages : 1
                    }
                }
            },
            clear (_url) {
                return {
                    path: '/list/' + _url.params.cid
                }
            }
        }
    }
}