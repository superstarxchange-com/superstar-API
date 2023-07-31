import smartpy as sp
FA2 = sp.io.import_script_from_url("https://smartpy.io/templates/FA2.py")


################### Error Messages ###################

class FA2ErrorMessage:
    PREFIX = "FA2_"
    NOT_ADMIN = "{}NOT_ADMIN".format(PREFIX)
    NOT_OWNER = "{}NOT_OWNER".format(PREFIX)
    NOT_ALLOWED = "{}NOT_ALLOWED".format(PREFIX)
    TOKEN_UNDEFINED = "{}TOKEN_UNDEFINED".format(PREFIX)
    DUPLICATE_TOKEN_ID = "{}DUPLICATE_TOKEN_ID".format(PREFIX)
    INVALID_QUANTITY = "{}INVALID_QUANTITY_NUMBER".format(PREFIX)
    INSUFFICIENT_BALANCE = "{}INSUFFICIENT_BALANCE".format(PREFIX)
    INVALID_PRICE = "{}INVALID_PRICE".format(PREFIX)
    TOKEN_NOT_ELIGIBLE_FOR_AUCTION = "{}TOKEN_NOT_ELIGIBLE_FOR_AUCTION".format(PREFIX)
    INVALID_AUCTION_DURATION = "{}INVALID_AUCTION_DURATION".format(PREFIX)

class MarketPlaceErrorMessage:
    PREFIX = "MARKETPLACE_"
    NOT_ADMIN = "{}NOT_ADMIN".format(PREFIX)
    NOT_OWNER = "{}NOT_OWNER".format(PREFIX)
    TOKEN_UNDEFINED = "{}TOKEN_UNDEFINED".format(PREFIX)
    INVALID_QUANTITY = "{}INVALID_QUANTITY_NUMBER".format(PREFIX)
    INVALID_PRICE = "{}INVALID_PRICE".format(PREFIX)
    DUPLICATE_SALE = "{}SALE_EXISTS_WITH_GIVEN_TOKEN_ID".format(PREFIX)
    NOT_FOR_SALE = "{}NOT_FOR_SALE".format(PREFIX)
    INSUFFICIENT_BALANCE = "{}INSUFFICIENT_BALANCE".format(PREFIX)

class AuctionPlaceErrorMessage:
    PREFIX = "AUCTIONPLACE_"
    NOT_ADMIN = "{}NOT_ADMIN".format(PREFIX)
    TOKEN_UNDEFINED = "{}TOKEN_UNDEFINED".format(PREFIX)
    NOT_FOR_AUCTION = "{}NOT_FOR_AUCTION".format(PREFIX)
    INVALID_PRICE = "{}INVALID_PRICE".format(PREFIX)
    SELLER_CANNOT_BID = "{}SELLER_CANNOT_BID".format(PREFIX)
    INVALID_AUCTION_DURATION = "{}INVALID_AUCTION_DURATION".format(PREFIX)
    BID_QUANTITY_TOO_LOW = "{}BID_QUANTITY_TOO_LOW".format(PREFIX)
    ALREADY_CLAIMED = "{}ALREADY_CLAIMED".format(PREFIX)
    NOT_HIGHEST_BIDDER = "{}NOT_HEIGHEST_BIDDER".format(PREFIX)
    AUCTION_EXPIRED = "{}AUCTION_EXPIRED".format(PREFIX)
    AUCTION_NOT_EXPIRED = "{}AUCTION_NOT_EXPIRED".format(PREFIX)
    INSUFFICIENT_BALANCE = "{}INSUFFICIENT_BALANCE".format(PREFIX)
    NOTHING_TO_REFUND = "{}NOTHING_TO_REFUND".format(PREFIX)
    DUPLICATE_AUCTION = "{}DUPLICATE_AUCTION".format(PREFIX)
    NFT_NOT_CLAIMED = "{}NFT_NOT_CLAIMED".format(PREFIX)
    NOT_OWNER = "{}NOT_OWNER".format(PREFIX)

################### Error Messages End ###################
    
################### Props ###################

class PROPS:
    MINIMAL_BID = sp.mutez(100000) # 1 XTZ
    MINIMAL_AUCTION_DURATION = sp.int(60*60) # 1 hour
    AUCTION_DURATION_EXTENSION_PER_BID = sp.int(60*10) # 10 minutes

################### Props End ###################

################### Helpers ###################

class Admins:
    def get_type():
        return sp.TSet(sp.TAddress)

    def get_add_params_type():
        return sp.TRecord(admins = Admins.get_type())

    def get_remove_params_type():
        return sp.TRecord(admins = Admins.get_type())

    def is_admin(admins, sender):
        return admins.contains(sender)

class Sale:
    def get_type():
        return sp.TRecord(
                tokenId = sp.TNat, 
                price = sp.TMutez,
                saleCreatedBy = sp.TAddress,
                hasMultipleQuantity = sp.TBool,
                quantity = sp.TNat,
                createdOn = sp.TTimestamp)
    
    def get_create_params_type():
        return sp.TRecord(
                tokenId = sp.TNat, 
                price = sp.TMutez,
                quantity = sp.TNat,
                owner = sp.TAddress,
                hasMultipleQuantity = sp.TBool)

    def get_update_params_type():
        return sp.TRecord(
                tokenId = sp.TNat, 
                price = sp.TNat,
                quantity = sp.TNat)

    def get_init_params_type():
        return sp.TRecord(
                market_place_address = sp.TAddress,
                tokenId = sp.TNat, 
                price = sp.TNat,
                quantity = sp.TNat)

class Buy:
    def get_type():
        return sp.TRecord(
            tokenId = sp.TNat,
            buyer = sp.TAddress,
            quantity = sp.TNat)

class Auction:
    def get_type():
        return sp.TRecord(
            tokenId = sp.TNat,
            basePrice = sp.TMutez,
            topBid = sp.TMutez,
            topBidder = sp.TAddress,
            endTimestamp = sp.TTimestamp,
            auctionCreatedBy = sp.TAddress,
            createdOn = sp.TTimestamp,
            claimed = sp.TBool)
    
    def get_init_params_type():
        return sp.TRecord(
            auction_place_address = sp.TAddress,
            tokenId = sp.TNat,
            basePrice = sp.TMutez,
            endTimestamp = sp.TTimestamp)

    def get_create_params_type():
        return sp.TRecord(
            tokenId = sp.TNat,
            basePrice = sp.TMutez,
            owner = sp.TAddress,
            endTimestamp = sp.TTimestamp)

    def get_bid_params_type():
        return sp.TRecord(
            tokenId = sp.TNat,
            bidder = sp.TAddress,
            bid = sp.TNat)

    def get_withdraw_params_type():
        return sp.TRecord(
            tokenId = sp.TNat,
            basePrice = sp.TMutez,
            tokenQuantity = sp.TNat,
            currentBid = sp.TMutez,
            currentBidder = sp.TAddress,
            endTimestamp = sp.TTimestamp,
            auctionCreatedBy = sp.TAddress,
            createdOn = sp.TTimestamp)

class NFTMetadata:
    def get_type():
        return sp.TMap(sp.TString, sp.TBytes)

class Mint:
    def get_params_type():
        return sp.TRecord(
            tzToAddress = sp.TAddress, 
            tokenId = sp.TNat,
            quantity = sp.TNat,
            metadata = NFTMetadata.get_type())

class Transfer:
    def get_params_type():
        return sp.TRecord(
            from_ = sp.TAddress, 
            tokenId = sp.TNat, 
            quantity = sp.TNat,
            to_ = sp.TAddress)

class Allowances:
    def get_key_type():
        return sp.TRecord(
            owner = sp.TAddress,
            operator = sp.TAddress,
            tokenId = sp.TNat)
    
    def get_value_type():
        return sp.TNat
    
    def make_key(owner, operator, tokenId):
        return sp.record(
            owner = owner,
            operator = operator,
            tokenId = tokenId)

class Bank:
    def get_key_type():
        return sp.TRecord(
            bidder = sp.TAddress,
            tokenId = sp.TNat)
    
    def get_value_type():
        return sp.TMutez
    
    def make_key(bidder, tokenId):
        return sp.record(
            bidder = bidder,
            tokenId = tokenId)

################### Helpers End ###################

################### FA2 ###################

class SuperstarXchangeFA2(FA2.FA2):

    def __init__(self, config, metadata, admin):
        FA2.FA2.__init__(self, config, metadata, admin)
        self.update_initial_storage(
            admins = sp.set([admin]),
            allowances = sp.big_map(l = {}, tkey = Allowances.get_key_type(), tvalue = Allowances.get_value_type()))

    """ [admins] """
    @sp.entry_point
    def add_admin(self, params):
        sp.set_type_expr(params, Admins.get_add_params_type())
        sp.verify((self.data.admins).contains(sp.sender), message = FA2ErrorMessage.NOT_ADMIN)
        sp.for new_admin in params.admins.elements():
            self.data.admins.add(new_admin)

    """ [admins] """
    @sp.entry_point
    def remove_admin(self,params):
        sp.set_type_expr(params, Admins.get_remove_params_type())
        sp.verify((self.data.admins).contains(sp.sender), message = FA2ErrorMessage.NOT_ADMIN)
        sp.for to_remove in params.admins.elements():
            sp.verify(to_remove != self.data.administrator, message = FA2ErrorMessage.NOT_ALLOWED)    
            self.data.admins.remove(to_remove)

    """ [address] """
    @sp.onchain_view(name = "is_admin")
    def is_admin(self, address):
        sp.result((self.data.admins).contains(address))

    """ [tokenId] """
    @sp.onchain_view(name = "token_exists")
    def token_exists(self, tokenId):
        sp.result(self.data.all_tokens.contains(tokenId))

    """ [address, tokenId, tokenQuantity] """
    @sp.onchain_view(name = "sufficient_token_quantity")
    def sufficient_token_quantity(self, params):
        ''' Given tokenId exists '''
        user = self.ledger_key.make(params.address, params.tokenId)
        sp.if ~self.data.ledger.contains(user):
            sp.result(sp.bool(False))
        sp.else:
            sp.result(self.data.ledger[user].balance >= params.tokenQuantity)

    """ [tokenId] """
    @sp.onchain_view(name = "has_multiple_editions")
    def has_multiple_editions(self, tokenId):
        ''' Given tokenId exists '''
        sp.result(self.data.total_supply[tokenId] > 1)

    """ [tzToAddress, tokenId, hasMultipleQuantity, quantity, metadata] """
    @sp.entry_point
    def mint(self, params):
        sp.set_type_expr(params, Mint.get_params_type())
        sp.verify((self.data.admins).contains(sp.sender), message = FA2ErrorMessage.NOT_ADMIN)
        sp.verify(~ self.token_id_set.contains(self.data.all_tokens, params.tokenId), message = FA2ErrorMessage.DUPLICATE_TOKEN_ID)
        invalidQuantLogic = (( (~ params.hasMultipleQuantity) & (params.quantity > 1) ) | ( (params.hasMultipleQuantity) & (params.quantity <= 1) ) | (params.quantity == 0))
        sp.verify(~invalidQuantLogic, message = MarketPlaceErrorMessage.INVALID_QUANTITY)

        self.token_id_set.add(self.data.all_tokens, params.tokenId)
        
        user = self.ledger_key.make(params.tzToAddress, params.tokenId)
        sp.if self.data.ledger.contains(user):
            self.data.ledger[user].balance += params.quantity
        sp.else:
            self.data.ledger[user] = FA2.Ledger_value.make(params.quantity)

        sp.if self.data.token_metadata.contains(params.tokenId):
            if self.config.store_total_supply:
                self.data.total_supply[params.tokenId] += params.quantity
        sp.else:
            self.data.token_metadata[params.tokenId] = sp.record(
                token_id    = params.tokenId,
                token_info  = params.metadata
            )
            if self.config.store_total_supply:
                self.data.total_supply[params.tokenId] = params.quantity

    """ [from_, tokenId, quantity, to_] """
    @sp.entry_point
    def single_transfer(self, params):
        sp.set_type_expr(params, Transfer.get_params_type())
        allowances_key = sp.local('allowances_key', 
                            Allowances.make_key(
                                        params.from_,
                                        sp.sender,
                                        params.tokenId))
        sp.verify(
            (sp.sender == params.from_) |  ((self.data.allowances.get(allowances_key.value, 0) 
            >= params.quantity)), message = FA2ErrorMessage.NOT_OWNER)
        sp.verify(self.data.all_tokens.contains(params.tokenId), message = FA2ErrorMessage.TOKEN_UNDEFINED)
        sp.verify(params.quantity > 0, message = FA2ErrorMessage.INVALID_QUANTITY)

        from_user = self.ledger_key.make(params.from_, params.tokenId)
        to_user = self.ledger_key.make(params.to_, params.tokenId)

        current_balance = self.data.ledger.get(from_user, sp.record(balance = 0)).balance
        sp.verify( current_balance >= params.quantity, message = FA2ErrorMessage.INVALID_QUANTITY)
        self.data.ledger[from_user].balance = sp.as_nat(current_balance - params.quantity)
        sp.if self.data.ledger.contains(to_user):
            self.data.ledger[to_user].balance += params.quantity
        sp.else:
            self.data.ledger[to_user] = FA2.Ledger_value.make(params.quantity)

        sp.if self.data.ledger[from_user].balance == 0:
            del self.data.ledger[from_user]
        
        sp.if sp.sender != params.from_:
            current_allowance = self.data.allowances[allowances_key.value]
            self.data.allowances[allowances_key.value] = sp.as_nat(current_allowance - params.quantity)
            sp.if self.data.allowances[allowances_key.value] == 0:
                del self.data.allowances[allowances_key.value]
            
    """ [market_place_address, tokenId, price, quantity] """
    @sp.entry_point
    def init_sale(self, params):
        sp.set_type_expr(params, Sale.get_init_params_type())
        sp.verify((self.data.admins).contains(sp.sender), message = FA2ErrorMessage.NOT_ADMIN)
        sp.verify(self.data.total_supply.contains(params.tokenId), message = FA2ErrorMessage.TOKEN_UNDEFINED)
        sp.verify(params.price >= 0, message = FA2ErrorMessage.INVALID_PRICE)
        sp.verify(params.quantity > 0, message = "Invalid Quantity")
        sender = self.ledger_key.make(sp.sender, params.tokenId)
        sp.verify(self.data.ledger.get(sender, sp.record(balance = 0)).balance >= params.quantity, message = FA2ErrorMessage.INSUFFICIENT_BALANCE)
        market_place = sp.contract(Sale.get_create_params_type(), params.market_place_address, entry_point = "create_sale").open_some()
        sp.transfer(sp.record(tokenId = params.tokenId, 
                                price = sp.utils.nat_to_mutez(params.price), 
                                quantity = params.quantity, 
                                owner = sp.sender, 
                                hasMultipleQuantity = self.data.total_supply[params.tokenId] > 1), 
                            sp.mutez(0), 
                            market_place)
        allowances_key = Allowances.make_key(sp.sender, params.market_place_address, params.tokenId)
        self.data.allowances[allowances_key] = params.quantity

    """ [auction_place_address, tokenId, basePrice, endTimestamp] """
    @sp.entry_point
    def init_auction(self, params):
        sp.set_type_expr(params, Auction.get_init_params_type())
        sp.verify((self.data.admins).contains(sp.sender), message = FA2ErrorMessage.NOT_ADMIN)
        sp.verify(self.data.total_supply.contains(params.tokenId), message = FA2ErrorMessage.TOKEN_UNDEFINED)
        quantity = self.data.total_supply[params.tokenId]
        sp.verify(quantity == 1, message = FA2ErrorMessage.TOKEN_NOT_ELIGIBLE_FOR_AUCTION)
        sp.verify(params.basePrice >= 0, message = FA2ErrorMessage.INVALID_PRICE)
        sp.verify(params.endTimestamp >= sp.now.add_seconds(PROPS.MINIMAL_AUCTION_DURATION), message = FA2ErrorMessage.INVALID_AUCTION_DURATION)
        sender = self.ledger_key.make(sp.sender, params.tokenId)
        sp.verify(self.data.ledger.contains(sender), message = FA2ErrorMessage.INSUFFICIENT_BALANCE)
        auction_place = sp.contract(Auction.get_create_params_type(), params.auction_place_address, entry_point = "create_auction").open_some()
        sp.transfer(sp.record(tokenId = params.tokenId, 
                                basePrice = sp.utils.nat_to_mutez(params.basePrice),  
                                owner = sp.sender,
                                endTimestamp = params.endTimestamp), 
                            sp.mutez(0), 
                            auction_place)
        allowances_key = Allowances.make_key(sp.sender, params.auction_place_address, params.tokenId)
        self.data.allowances[allowances_key] = 1

################### FA2 End ###################

################### Market Place ###################

class MarketPlace(sp.Contract):
    def __init__(self, fa2_contract_address, metadata):
        self.init(
            fa2_contract_address = fa2_contract_address,
            metadata = metadata,
            sales = sp.big_map(
                l = {},
                tkey = sp.TNat, 
                tvalue = Sale.get_type())
            )

    """ [address] """
    @sp.private_lambda(with_operations=True, with_storage="read-only", wrap_call=True)
    def is_admin(self, address):
        sp.result(sp.view("is_admin", self.data.fa2_contract_address, address, t = sp.TBool).open_some("Invalid is_admin view"))

    """ [address, tokenId, tokenQuantity] """
    @sp.private_lambda(with_operations=True, with_storage="read-only", wrap_call=True)
    def sufficient_token_quantity(self, params):
        sp.result(sp.view("sufficient_token_quantity", self.data.fa2_contract_address, params, t = sp.TBool).open_some("Invalid sufficient_token_quantity view"))

    """ [address] """
    @sp.entry_point
    def set_fa2_contract_addr(self, params):
        sp.set_type(params, sp.TRecord(address = sp.TAddress))
        sp.verify(self.is_admin(sp.sender), message = MarketPlaceErrorMessage.NOT_ADMIN)
        self.data.fa2_contract_address = params.address

    """ [tokenId, price, quantity, owner, hasMultipleQuantity] """
    @sp.entry_point
    def create_sale(self, params):
        sp.verify(sp.sender == self.data.fa2_contract_address, message = MarketPlaceErrorMessage.NOT_ADMIN)
        sp.verify(~ self.data.sales.contains(params.tokenId), message = MarketPlaceErrorMessage.DUPLICATE_SALE)
        self.data.sales[params.tokenId] = sp.record(
            tokenId = params.tokenId,
            price = params.price, 
            saleCreatedBy = params.owner,
            hasMultipleQuantity = params.hasMultipleQuantity,  
            quantity = params.quantity,
            createdOn = sp.now)

    """ [tokenId, buyer, quantity] """
    @sp.entry_point
    def buy(self, params):
        sp.set_type_expr(params, Buy.get_type())
        sp.verify(self.is_admin(sp.sender), message = MarketPlaceErrorMessage.NOT_ADMIN)
        sp.verify(self.data.sales.contains(params.tokenId), message = MarketPlaceErrorMessage.NOT_FOR_SALE)
        sale = self.data.sales[params.tokenId]
        sp.verify(sale.quantity >= params.quantity, message = MarketPlaceErrorMessage.INVALID_QUANTITY)
        fa2_contract = sp.contract(Transfer.get_params_type(), self.data.fa2_contract_address, entry_point = "single_transfer").open_some()
        sp.transfer(sp.record(from_ = sale.saleCreatedBy, 
                                tokenId = params.tokenId,
                                quantity = params.quantity,
                                to_ = params.buyer), 
                            sp.mutez(0), 
                            fa2_contract)
        
        sale.quantity = sp.as_nat(sale.quantity - params.quantity)
        sp.if sale.quantity == 0:
            del self.data.sales[params.tokenId]
        sp.else:
            self.data.sales[params.tokenId] = sale

    """ [tokenId, price, quantity] """
    @sp.entry_point
    def update_sale(self, params):
        sp.set_type_expr(params, Sale.get_update_params_type())
        sp.verify(self.data.sales.contains(params.tokenId), message = MarketPlaceErrorMessage.NOT_FOR_SALE)
        sale = self.data.sales[params.tokenId]
        sp.verify(sale.saleCreatedBy == sp.sender, message = MarketPlaceErrorMessage.NOT_OWNER)
        sp.verify(params.price >= 0, message = MarketPlaceErrorMessage.INVALID_PRICE)
        sp.verify(self.sufficient_token_quantity(sp.record(address = sp.sender, tokenId = params.tokenId, tokenQuantity = params.quantity)), message = MarketPlaceErrorMessage.INVALID_QUANTITY)
        sale.price = sp.utils.nat_to_mutez(params.price)
        sale.quantity = params.quantity
        self.data.sales[params.tokenId] = sale

    """ [tokenId] """
    @sp.entry_point
    def remove_sale(self, params):
        sp.set_type(params, sp.TRecord(tokenId = sp.TNat))
        sp.verify(self.data.sales.contains(params.tokenId), message = MarketPlaceErrorMessage.NOT_FOR_SALE)
        sale = self.data.sales[params.tokenId]
        sp.verify(sale.saleCreatedBy == sp.sender, message = MarketPlaceErrorMessage.NOT_OWNER)
        del self.data.sales[params.tokenId]

################### Market Place End ###################

################### Auction Place ###################

class AuctionPlace(sp.Contract):
    def __init__(self, fa2_contract_address, metadata):
        self.init(
            fa2_contract_address = fa2_contract_address,
            metadata = metadata,
            auctions = sp.big_map(
                l = {},
                tkey = sp.TNat,
                tvalue = Auction.get_type()),
            bank = sp.big_map(
                l = {},
                tkey = Bank.get_key_type(),
                tvalue = Bank.get_value_type())
            )

    """ [address] """
    @sp.private_lambda(with_operations=True, with_storage="read-only", wrap_call=True)
    def is_admin(self, address):
        sp.result(sp.view("is_admin", self.data.fa2_contract_address, address, t = sp.TBool).open_some("Invalid is_admin view"))

    """ [tokenId, basePrice, owner, endTimestamp] """
    @sp.entry_point
    def create_auction(self, params):
        sp.verify(sp.sender == self.data.fa2_contract_address, message = AuctionPlaceErrorMessage.NOT_ADMIN)
        sp.verify(~ self.data.auctions.contains(params.tokenId), message = AuctionPlaceErrorMessage.DUPLICATE_AUCTION)
        self.data.auctions[params.tokenId] = sp.record(
            tokenId = params.tokenId,
            basePrice = params.basePrice,
            topBid = params.basePrice,
            topBidder = sp.sender,
            endTimestamp = params.endTimestamp,
            auctionCreatedBy = params.owner,
            createdOn = sp.now,
            claimed = sp.bool(False))

    """ [tokenId, bidder, bid] """
    @sp.entry_point
    def bid(self, params):
        sp.set_type_expr(params, Auction.get_bid_params_type())
        sp.verify(self.is_admin(sp.sender), message = MarketPlaceErrorMessage.NOT_ADMIN)
        sp.verify(self.data.auctions.contains(params.tokenId), message = AuctionPlaceErrorMessage.NOT_FOR_AUCTION)
        auction = self.data.auctions[params.tokenId]
        sp.verify(sp.sender != auction.auctionCreatedBy, message = AuctionPlaceErrorMessage.SELLER_CANNOT_BID)
        sp.verify(auction.endTimestamp >= sp.now, message = AuctionPlaceErrorMessage.AUCTION_EXPIRED)
        sp.verify(sp.utils.nat_to_mutez(params.bid) >= auction.topBid + PROPS.MINIMAL_BID, message = AuctionPlaceErrorMessage.BID_QUANTITY_TOO_LOW)
        bank_key = Bank.make_key(auction.topBidder, auction.tokenId)
        sp.if self.data.bank.contains(bank_key):
            self.data.bank[bank_key] += auction.topBid
        sp.else:
            self.data.bank[bank_key] = auction.topBid
        auction.topBid = sp.utils.nat_to_mutez(params.bid)
        auction.topBidder = params.bidder
        auction.endTimestamp = sp.now.add_seconds(PROPS.AUCTION_DURATION_EXTENSION_PER_BID)
        self.data.auctions[params.tokenId] = auction

    """ [tokenId] """
    @sp.entry_point
    def claim_refund(self, params):
        '''
        Here user will make a call and hence requires some gas to be preloaded in user tez account
        '''
        sp.set_type_expr(params, sp.TRecord(tokenId = sp.TNat))
        sp.verify(self.data.auctions.contains(params.tokenId), message = AuctionPlaceErrorMessage.NOT_FOR_AUCTION)
        auction = self.data.auctions[params.tokenId]
        bank_key = Bank.make_key(sp.sender, params.tokenId)
        sp.verify(self.data.bank.contains(bank_key), message = AuctionPlaceErrorMessage.NOTHING_TO_REFUND)
        del self.data.bank[bank_key]

    """ [tokenId, topBidder] """
    @sp.entry_point
    def claim_nft(self, params):
        sp.set_type_expr(params, sp.TRecord(tokenId = sp.TNat, topBidder = sp.TAddress))
        sp.verify(self.data.auctions.contains(params.tokenId), message = AuctionPlaceErrorMessage.NOT_FOR_AUCTION)
        auction = self.data.auctions[params.tokenId]
        sp.verify(sp.now > auction.endTimestamp, message = AuctionPlaceErrorMessage.AUCTION_NOT_EXPIRED)
        sp.verify(params.topBidder == auction.topBidder, message = AuctionPlaceErrorMessage.NOT_HIGHEST_BIDDER)
        sp.verify(~auction.claimed, message = AuctionPlaceErrorMessage.ALREADY_CLAIMED)
        fa2_contract = sp.contract(Transfer.get_params_type(), self.data.fa2_contract_address, entry_point = "single_transfer").open_some()
        sp.transfer(sp.record(from_ = auction.auctionCreatedBy, 
                                tokenId = params.tokenId,
                                quantity = 1,
                                to_ = params.topBidder), 
                            sp.mutez(0), 
                            fa2_contract)
        auction.claimed = sp.bool(True)
        self.data.auctions[params.tokenId] = auction
    
    """ [tokenId] """
    @sp.entry_point
    def remove_auction(self, params):
        sp.set_type(params, sp.TRecord(tokenId = sp.TNat))
        sp.verify(self.data.auctions.contains(params.tokenId), message = AuctionPlaceErrorMessage.NOT_FOR_AUCTION)
        auction = self.data.auctions[params.tokenId]
        sp.verify(auction.auctionCreatedBy == sp.sender, message = AuctionPlaceErrorMessage.NOT_OWNER)
        sp.verify(sp.now > auction.endTimestamp, message = AuctionPlaceErrorMessage.AUCTION_NOT_EXPIRED)
        sp.verify(auction.claimed == sp.bool(True), message = AuctionPlaceErrorMessage.NFT_NOT_CLAIMED)
        del self.data.auctions[params.tokenId]

################### Auction Place End ###################


################### Tests ###################

@sp.add_test(name = "superstarXchangeFA2-Test")
def test():

    admin = sp.test_account("admin")
    admin1 = sp.test_account("admin1")
    admin2 = sp.test_account("admin2")
    user1 = sp.test_account("user1")
    user2 = sp.test_account("user2")

    sc = sp.test_scenario()
    sc.h1("SuperstarXChange")
    sc.table_of_contents()

    sc.h2("Accounts")
    sc.show([admin,admin1,admin2,user1,user2])

    sc.h2("SuperstarXChangeFA2")
    fa2 = SuperstarXchangeFA2(
        FA2.FA2_config(non_fungible=True, assume_consecutive_token_ids=False, store_total_supply=True),
        admin=admin.address,
        metadata = sp.utils.metadata_of_url("https://example.com"))
    sc += fa2

    sc.h2("Market Place")
    mp = MarketPlace(
        fa2_contract_address = fa2.address, 
        metadata = sp.utils.metadata_of_url("ipfs://QmcxDJ66gGNKRy6setAbVuoidCPgFTZm3iTtNnajHVUu4p"))
    sc += mp

    def newNFT(toAddr, tokenId, hasMultipleQuantity, quantity):
        return sp.record(
            tzToAddress = toAddr,
            tokenId = tokenId,
            hasMultipleQuantity = hasMultipleQuantity,
            quantity = quantity,
            metadata = {
                "name" : sp.utils.bytes_of_string("Bahubali NFT #3"),
                "symbol" : sp.utils.bytes_of_string("SUPERSTAR"),
                "decimals" : sp.utils.bytes_of_string("0"),
                "artifactUri" : sp.utils.bytes_of_string("ipfs://QmdByT2kNwSLdYfASoWEXyZhRYgLtvBnzJYBM1zvZXhCnS"),
                "displayUri" : sp.utils.bytes_of_string("ipfs://QmdByT2kNwSLdYfASoWEXyZhRYgLtvBnzJYBM1zvZXhCnS"),
                "thumbnailUri" : sp.utils.bytes_of_string("ipfs://QmXJSgZeKS9aZrHkp81hRtZpWWGCkkBma9d6eeUPfJsLEV"),
                "metadata" : sp.utils.bytes_of_string("ipfs://QmYP9i9axHywpMEaAcCopZz3DvAXvR7Bg7srNvrRbNUBTh")
            }
        )
    def newSale(tokenId, quantity, price):
        return sp.record(
            market_place_address = mp.address,
            tokenId = tokenId,
            quantity = quantity,
            price = price)
    
    sc.p("admin adds admin1 and admin2 as admins")
    params = sp.record(admins = sp.set([admin1.address, admin2.address]))
    sc += fa2.add_admin(params).run(sender = admin)

    sc.p("admin1 removes admin from being admin")
    params = sp.record(admins = sp.set([admin.address]))
    sc += fa2.remove_admin(params).run(sender = admin1, valid = False)

    sc.p("admin1 removes admin2 from being admin")
    params = sp.record(admins = sp.set([admin2.address]))
    sc += fa2.remove_admin(params).run(sender = admin1)

    sc.p("admin1 mints NFTs to self")
    params = newNFT(admin1.address, 1, True, 10)
    sc += fa2.mint(params).run(sender = admin1)

    sc.p("admin1 creates a sale with access quantity")
    params = newSale(1, 20, 10000000)
    sc += fa2.init_sale(params).run(sender = admin1, valid = False)

    sc.p("admin1 creates a sale")
    params = newSale(1, 5, 10000000)
    sc += fa2.init_sale(params).run(sender = admin1)

    sc.p("user1 try to buy above sale in excess quantity. Admin will make transaction")
    params = sp.record(tokenId = 1, buyer = user1.address, quantity = 20)
    sc += mp.buy(params).run(sender = admin, valid = False)

    sc.p("user1 try to buy above sale, Admin will make transaction")
    params = sp.record(tokenId = 1, buyer = user1.address, quantity = 3)
    sc += mp.buy(params).run(sender = admin)

    sc.p("user1 again buys above sale, Admin will make transaction")
    params = sp.record(tokenId = 1, buyer = user1.address, quantity = 2)
    sc += mp.buy(params).run(sender = admin)
    
    auction_admin = sp.test_account("auction_admin")
    auction_user1 = sp.test_account("user1")
    auction_user2 = sp.test_account("user2")

    sc.h2("Auction Accounts")
    sc.show([auction_admin, auction_user1, auction_user2])

    sc.h2("Auction Place")
    auction_place = AuctionPlace(
        fa2_contract_address = fa2.address,
        metadata = sp.utils.metadata_of_url("https://example.com"))
    sc += auction_place

    def newAuction(auction_place_address, tokenId, basePrice, endTimestamp):
        return sp.record(
            auction_place_address = auction_place_address,
            tokenId = tokenId,
            basePrice = basePrice,
            endTimestamp = endTimestamp)

    def newBid(tokenId, bidder, bid):
        return sp.record(
            tokenId = tokenId,
            bidder = bidder,
            bid = bid)

    sc.p("add auction_admin as admin")
    params = sp.record(admins = sp.set([auction_admin.address]))
    sc += fa2.add_admin(params).run(sender = admin)

    sc.p("auction_admin mints NFT to self")
    params = newNFT(auction_admin.address, 123, False, 1)
    sc += fa2.mint(params).run(sender = auction_admin)

    sc.p("auction_admin inits new auction")
    params = newAuction(auction_place.address, 123, 1000000, sp.now.add_seconds(50000))
    sc += fa2.init_auction(params).run(sender = auction_admin)

    sc.p("auction_admin removes auction")
    params = sp.record(tokenId = 123)
    sc += auction_place.remove_auction(params).run(sender = auction_admin, valid = False)

    sc.p("auction_admin bids : who also created the auction")
    params = newBid(123, auction_user1.address, 10000)
    sc += auction_place.bid(params).run(sender = auction_admin, valid = False)

    sc.p("admin bids on behalf of auction_user1 : bid too low")
    params = newBid(123, auction_user1.address, 10000)
    sc += auction_place.bid(params).run(sender = admin, valid = False)

    sc.p("admin bids on behalf of auction_user1")
    params = newBid(123, auction_user1.address, 2000000)
    sc += auction_place.bid(params).run(sender = admin)
    
    sc.p("admin bids on behalf of auction_user2")
    params = newBid(123, auction_user2.address, 5000000)
    sc += auction_place.bid(params).run(sender = admin)

    sc.p("admin bids on behalf of auction_user1")
    params = newBid(123, auction_user1.address, 4000000)
    sc += auction_place.bid(params).run(sender = admin, valid = False)

    sc.p("admin bids on behalf of auction_user1")
    params = newBid(123, auction_user1.address, 10000000)
    sc += auction_place.bid(params).run(sender = admin)

    sc.p("auction_user2 clamins refund as he lost the bid")
    params = sp.record(tokenId = 123)
    sc += auction_place.claim_refund(params).run(sender = auction_user2)

    sc.p("auction_user1 clamins NFT as he won the auction")
    params = sp.record(tokenId = 123, topBidder = auction_user1.address)
    sc += auction_place.claim_nft(params).run(sender = auction_user1, valid = False)# comment out the auction_not_expired check to make this valid = True

################### Tests End ###################

################### Compilation ###################

sp.add_compilation_target(
    "FA2-SuperstarXChange", 
    SuperstarXchangeFA2(
        admin=sp.address("tz1TpvrMd352n7LZgb3TAd1kE4XZvTLS5EvR"), 
        config = FA2.FA2_config(non_fungible=True, assume_consecutive_token_ids=False, store_total_supply=True),
        metadata=sp.utils.metadata_of_url("ipfs://Qmdy7yYJfunXFiNqVh4zqxxaot1vxQsUiZkBpvekEd8ksW")
    )
)

sp.add_compilation_target(
    "MarketPlace-SuperstarXChange",
    MarketPlace(
        fa2_contract_address = sp.address("KT1GQ2B39PcjCn8FaDof7QBhoLoLgAWae87j"),
        metadata=sp.utils.metadata_of_url("ipfs://QmcEzRJ6Z1fwV9SxnbmWVGrmTdhSzfykcLQbDRe95Gx1yh")
    )
)

sp.add_compilation_target(
    "AuctionPlace-SuperstarXChange",
    AuctionPlace(
        fa2_contract_address = sp.address("KT1GQ2B39PcjCn8FaDof7QBhoLoLgAWae87j"),
        metadata=sp.utils.metadata_of_url("ipfs://QmYENEN2QBqyLS9pVhh83hef6eFnCfDmAHTYQTPj6tjMbF")
    )
)

################### Compilation End ###################
