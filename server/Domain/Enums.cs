namespace Salon.Api.Domain;

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    CheckedIn,
    InProgress,
    Completed,
    Cancelled,
    NoShow
}

public enum PaymentStatus
{
    Unpaid,
    DepositPaid,
    Paid,
    PartiallyRefunded,
    Refunded
}

public enum ReviewStatus
{
    Pending,
    Approved,
    Rejected
}

public enum OrderStatus
{
    Pending,
    Paid,
    Processing,
    ReadyForPickup,
    Shipped,
    Completed,
    Cancelled,
    Refunded
}

public enum MembershipStatus
{
    Active,
    Paused,
    Cancelled,
    Expired
}

public enum LoyaltyTransactionType
{
    Earn,
    Redeem,
    Adjustment,
    Expire
}

public enum GiftCardStatus
{
    Active,
    Redeemed,
    Expired,
    Disabled
}

public enum DiscountType
{
    Percentage,
    FixedAmount
}

public enum ContactInquiryStatus
{
    New,
    InProgress,
    Resolved,
    Spam
}
